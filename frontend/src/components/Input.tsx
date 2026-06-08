import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
