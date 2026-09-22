export function Welcome({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Welcome"
      className={`flex h-full max-h-welcome-h w-full flex-col gap-2 rounded-2xl border border-line bg-surface px-6 py-8 ${className}`}
    />
  )
}
