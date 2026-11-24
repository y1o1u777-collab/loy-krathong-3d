import { supabase, isSupabaseConfigured } from './supabase'
import type { Krathong, KrathongDraft } from '../types'

const LOCAL_KEY = 'loy-krathong-3d-local'

function readLocal(): Krathong[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    const saved = raw ? (JSON.parse(raw) as Krathong[]) : []
    return saved
  } catch {
    return []
  }
}
export async function fetchKrathongs(): Promise<Krathong[]> {
  if (!isSupabaseConfigured || !supabase) return readLocal()
  const { data, error } = await supabase
    .from('krathongs')
    .select('id, sender_name, wish_message, base_type, flower_type, created_at')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return (data ?? []) as Krathong[]
}

export async function createKrathong(draft: KrathongDraft): Promise<Krathong> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('krathongs')
      .insert(draft)
      .select('id, sender_name, wish_message, base_type, flower_type, created_at')
      .single()
    if (error) throw error
    return data as Krathong
  }

  const item: Krathong = {
    ...draft,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') as Krathong[]
    localStorage.setItem(LOCAL_KEY, JSON.stringify([item, ...existing]))
  } catch {
    // The in-memory river still displays the newly-created krathong if storage is unavailable.
  }
  return item
}


export function subscribeToKrathongs(
  onInsert: (krathong: Krathong) => void
) {
  if (!isSupabaseConfigured || !supabase) {
    return () => undefined;
  }

  // เก็บ Supabase client ไว้ในตัวแปรที่ไม่เป็น null
  const client = supabase;

  const channel = client
    .channel('public-krathongs-river')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'krathongs',
      },
      (payload: { new: Record<string, unknown> }) => {
        onInsert(payload.new as unknown as Krathong);
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
