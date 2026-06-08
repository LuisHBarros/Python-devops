import { useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { useAuth } from "../context/useAuth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
              {getInitials(user.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-auto px-5" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_50%)] p-8 md:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              Olá, {user.name.split(" ")[0]}!
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Você está autenticado com sucesso. Este é seu painel de boas-vindas.
            </p>
          </div>

          <div className="grid gap-4 border-t border-white/10 p-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">E-mail</p>
              <p className="mt-2 font-medium text-white">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Membro desde</p>
              <p className="mt-2 font-medium text-white">{formatDate(user.date_joined)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-2 inline-flex items-center gap-2 font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Autenticado
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
