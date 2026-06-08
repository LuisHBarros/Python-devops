interface AlertProps {
  message: string;
  type?: "error" | "success";
}

export function Alert({ message, type = "error" }: AlertProps) {
  const styles = {
    error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}
      role="alert"
    >
      {message}
    </div>
  );
}
