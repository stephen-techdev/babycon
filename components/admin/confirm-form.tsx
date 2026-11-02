"use client";

export function ConfirmForm({
  action,
  fields,
  message,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string | number>;
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={className}
    >
      {Object.entries(fields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      {children}
    </form>
  );
}
