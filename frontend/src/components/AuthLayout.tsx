import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.35),transparent_55%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Conteiners
            </p>
            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight text-white">
              Autenticação segura com JWT e uma experiência moderna.
            </h1>
            <p className="mt-4 max-w-md text-slate-300">
              Cadastre-se, entre na sua conta e acesse seu dashboard personalizado
              em poucos segundos.
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">JWT</p>
              <p className="mt-1 text-sm text-slate-400">Tokens seguros</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">DRF</p>
              <p className="mt-1 text-sm text-slate-400">API RESTful</p>
            </div>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/login" className="text-sm font-semibold text-indigo-300">
                Conteiners
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
              </div>
              {children}
              <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
