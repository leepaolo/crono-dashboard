export function Welcome({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Welcome"
      className={`flex h-welcome-h w-welcome flex-col gap-2 rounded-2xl border border-action-menu-border bg-surface px-6 py-8 ${className}`}
    >
      <h1 className="text-welcome-title text-navy">Welcome Alex,</h1>
      <p className="text-welcome-body text-muted">
        Here's your performance overview where you can track your daily and monthly KPIs
      </p>
    </section>
  )
}
