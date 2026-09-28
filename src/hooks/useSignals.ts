import { useCallback, useEffect, useState } from 'react'
import * as signalsApi from '../api/signals'
import type { ISignalView } from '../types'

export function useSignals() {
  const [views, setViews] = useState<ISignalView[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    signalsApi
      .getSignals()
      .then((data) => {
        if (isMounted) {
          setViews(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const complete = useCallback(async (id: string) => {
    try {
      const updatedView = await signalsApi.completeSignal(id)
      setViews((current) =>
        current.map((view) => (view.signal.id === id ? updatedView : view)),
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [])

  const deleteSignal = useCallback(async (id: string) => {
    try {
      await signalsApi.deleteSignal(id)
      setViews((current) => current.filter((view) => view.signal.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [])

  const unreadCount = views.filter((view) => view.signal.unread).length

  return {
    signals: views,
    unreadCount,
    isLoading,
    error,
    complete,
    deleteSignal,
  }
}
