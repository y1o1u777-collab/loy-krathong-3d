import { useCallback, useEffect, useState } from 'react'
import { createKrathong, fetchKrathongs, subscribeToKrathongs } from '../lib/krathongs'
import { isSupabaseConfigured } from '../lib/supabase'
import type { Krathong, KrathongDraft } from '../types'

export function useKrathongs() {
  const [krathongs, setKrathongs] = useState<Krathong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchKrathongs()
      setKrathongs(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const unsubscribe = subscribeToKrathongs((incoming) => {
      setKrathongs((current) => current.some((item) => item.id === incoming.id)
        ? current
        : [incoming, ...current].slice(0, 100))
    })
    return unsubscribe
  }, [refresh])

  const add = useCallback(async (draft: KrathongDraft) => {
    const created = await createKrathong(draft)
    setKrathongs((current) => [created, ...current.filter((item) => item.id !== created.id)].slice(0, 100))
    return created
  }, [])

  return { krathongs, loading, error, add, refresh, isLive: isSupabaseConfigured }
}
