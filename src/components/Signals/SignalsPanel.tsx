import { useState } from 'react'
import { signalViews } from '../../data/readSignals'
import { SignalRow } from './SignalRow'
import { SignalsHeader } from './SignalsHeader'

const unreadSignals = signalViews.filter((view) => view.signal.unread)

export function SignalsPanel({ className = '' }: { className?: string }) {
  const [openSignalId, setOpenSignalId] = useState<string | null>(null)

  return (
    <section
      aria-label="Signals"
      className={`flex h-full max-h-signals-h w-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-surface pt-4 ${className}`}
    >
      <SignalsHeader unreadCount={unreadSignals.length} />
      <ul className="scrollbar-signals min-h-0 flex-1 overflow-y-auto">
        {unreadSignals.map((view) => (
          <SignalRow
            key={view.signal.id}
            {...view}
            menuOpen={openSignalId === view.signal.id}
            onMenuOpenChange={(open) => setOpenSignalId(open ? view.signal.id : null)}
          />
        ))}
      </ul>
    </section>
  )
}
