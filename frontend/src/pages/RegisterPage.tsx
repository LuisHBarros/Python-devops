import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert } from "../components/Alert";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/useAuth";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err) && err.response?.data) {
        const data = err.response.data as Record<string, string[] | string>;
        if (data.email) {
          setError(Array.isArray(data.email) ? data.email[0] : String(data.email));
        } else if (data.password) {
          setError(Array.isArray(data.password) ? data.password[0] : String(data.password));
        } else {
          setError("Não foi possível criar a conta. Verifique os dados.");
        }
      } else {
        setError("Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Preencha os dados abaixo para começar a usar a plataforma."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert message={error} />}
        <Input
          label="Nome completo"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirmar senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  );
}
