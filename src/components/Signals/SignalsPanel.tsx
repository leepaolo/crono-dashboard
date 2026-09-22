export function SignalsPanel({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Signals"
      className={`flex h-full max-h-signals-h w-full flex-col gap-3 rounded-2xl border border-line bg-surface pt-4 ${className}`}
    />
  )
}
