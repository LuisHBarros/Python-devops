import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "ghost";
}

export function Button({
  children,
  isLoading = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-violet-400",
    ghost:
      "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
