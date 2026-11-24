export type BaseType = 'banana' | 'lotus' | 'coconut'
export type FlowerType = 'marigold' | 'orchid' | 'gomphrena'

export interface Krathong {
  id: string
  sender_name: string
  wish_message: string
  base_type: BaseType
  flower_type: FlowerType
  created_at: string
}

export interface KrathongDraft {
  sender_name: string
  wish_message: string
  base_type: BaseType
  flower_type: FlowerType
}

export const BASE_OPTIONS: { id: BaseType; name: string; detail: string; color: string }[] = [
  { id: 'banana', name: 'ใบตองพับ', detail: 'กลีบซ้อน 3 ชั้น', color: '#4d9b55' },
  { id: 'lotus', name: 'ดอกบัวหลวง', detail: 'ชมพูม่วงอ่อนหวาน', color: '#d77bb4' },
  { id: 'coconut', name: 'กะลามะพร้าว', detail: 'ขอบทองคลาสสิก', color: '#9a603d' },
]

export const FLOWER_OPTIONS: { id: FlowerType; name: string; detail: string; color: string }[] = [
  { id: 'marigold', name: 'ดาวเรือง', detail: 'สีเหลืองทองเป็นมงคล', color: '#fbbf24' },
  { id: 'orchid', name: 'กล้วยไม้', detail: 'ม่วงสง่างาม', color: '#a855f7' },
  { id: 'gomphrena', name: 'บานไม่รู้โรย', detail: 'ชมพูม่วงสดใส', color: '#e879bd' },
]
