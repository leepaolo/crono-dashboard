import { useEffect, useState } from 'react'
import { signalViews, type SignalView } from '../data/readSignals'

const FETCH_DELAY_MS = 300

function copyViews(views: SignalView[]): SignalView[] {
  return views.map((view) => ({
    ...view,
    signal: {
      ...view.signal,
      segments: view.signal.segments.map((segment) => ({ ...segment })),
    },
  }))
}

function markProcessed(views: SignalView[], id: string): SignalView[] {
  return views.map((view) =>
    view.signal.id === id ? { ...view, signal: { ...view.signal, unread: false } } : view,
  )
}

export function useSignals() {
  const [views, setViews] = useState<SignalView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setViews(copyViews(signalViews))
      setLoading(false)
    }, FETCH_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const unread = views.filter((view) => view.signal.unread)

  return {
    signals: unread,
    unreadCount: unread.length,
    loading,
    complete: (id: string) => setViews((current) => markProcessed(current, id)),
    deleteSignal: (id: string) => setViews((current) => markProcessed(current, id)),
  }
}
