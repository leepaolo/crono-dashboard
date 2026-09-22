export function SignalsHeader({ unreadCount }: { unreadCount: number }) {
  return (
    <header className="flex h-signals-header-h w-signals shrink-0 flex-col gap-signals-header-gap px-signals-header-x">
      <div className="flex h-signals-title-h w-signals-title-w items-center gap-signals-title-gap">
        <h2 className="text-signals-title whitespace-nowrap text-ink">Signals</h2>
        <span className="inline-flex h-signals-badge-h w-signals-badge shrink-0 items-center justify-center gap-signals-badge-gap rounded-signals-badge bg-accent px-signals-badge-x py-signals-badge-y text-signals-badge text-surface">
          {unreadCount}
        </span>
      </div>
      <p className="text-signals-subtitle whitespace-nowrap text-muted">
        Never miss a single opportunity: check out your top signals from your 1st-degree LinkedIn
        connections.
      </p>
    </header>
  )
}
