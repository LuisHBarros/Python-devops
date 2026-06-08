import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert } from "../components/Alert";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError("E-mail ou senha inválidos.");
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre com seu e-mail e senha para acessar sua conta."
      footer={
        <>
          Não tem uma conta?{" "}
          <Link to="/register" className="font-medium text-indigo-300 hover:text-indigo-200">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert message={error} />}
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
