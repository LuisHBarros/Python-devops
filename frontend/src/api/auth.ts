import axios, { type InternalAxiosRequestConfig } from "axios";

import {
  API_BASE_URL,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./client";

import type {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<AuthTokens>(
        `${API_BASE_URL}/auth/token/refresh/`,
        { refresh },
      );
      setTokens(data.access, data.refresh);
      processQueue(data.access);
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register/", payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/auth/token/", payload);
  setTokens(data.access, data.refresh);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me/");
  return data;
}

export function logout(): void {
  clearTokens();
}

export default api;
