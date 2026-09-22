import signals from '../../data/signals.json'
import type { Signal } from '../../types'
import { SignalsHeader } from './SignalsHeader'

const signalList = signals as Signal[]

export function SignalsPanel({ className = '' }: { className?: string }) {
  const unreadCount = signalList.filter((signal) => signal.unread).length

  return (
    <section
      aria-label="Signals"
      className={`flex h-full max-h-signals-h w-full flex-col gap-3 rounded-2xl border border-line bg-surface pt-4 ${className}`}
    >
      <SignalsHeader unreadCount={unreadCount} />
    </section>
  )
}
