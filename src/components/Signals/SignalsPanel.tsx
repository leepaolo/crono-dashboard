import { useState } from 'react'
import { useSignals } from '../../hooks/useSignals'
import { SignalRow } from './SignalRow'
import { SignalsHeader } from './SignalsHeader'

export function SignalsPanel({ className = '' }: { className?: string }) {
  const { signals, unreadCount, loading, complete, deleteSignal } = useSignals()
  const [openSignalId, setOpenSignalId] = useState<string | null>(null)

  return (
    <section
      aria-label="Signals"
      aria-busy={loading}
      className={`flex h-full max-h-signals-h w-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-surface pt-4 ${className}`}
    >
      <SignalsHeader unreadCount={unreadCount} />
      <ul className="scrollbar-signals min-h-0 flex-1 overflow-y-auto">
        {signals.map((view) => (
          <SignalRow
            key={view.signal.id}
            {...view}
            menuOpen={openSignalId === view.signal.id}
            onMenuOpenChange={(open) => setOpenSignalId(open ? view.signal.id : null)}
            onComplete={() => {
              complete(view.signal.id)
              setOpenSignalId(null)
            }}
            onDelete={() => {
              deleteSignal(view.signal.id)
              setOpenSignalId(null)
            }}
          />
        ))}
      </ul>
    </section>
  )
}
