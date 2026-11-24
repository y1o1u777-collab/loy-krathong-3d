import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type InstallPlatform = 'ios' | 'android' | null

export default function PWAInstallPrompt() {
  const [platform, setPlatform] = useState<InstallPlatform>(null)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) return

    const dismissed = window.localStorage.getItem('loy-krathong-install-dismissed') === '1'
    const userAgent = window.navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    const isAndroid = /Android/i.test(userAgent)
    if (isIOS || isAndroid) {
      setPlatform(isIOS ? 'ios' : 'android')
      setVisible(!dismissed)
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setPlatform('android')
      setVisible(!dismissed)
    }
    const onInstalled = () => {
      setVisible(false)
      setInstallEvent(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    window.localStorage.setItem('loy-krathong-install-dismissed', '1')
    setVisible(false)
  }

  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') setVisible(false)
    setInstallEvent(null)
  }

  if (!visible || !platform) return null

  return (
    <aside className="pwa-install-card" aria-label="ติดตั้งแอปลอยกระทง 3D">
      <div className="pwa-install-icon"><Download size={18} /></div>
      <div className="pwa-install-copy">
        <strong>{platform === 'ios' ? 'เพิ่มลอยกระทง 3D ลงหน้าจอโฮม' : 'ติดตั้งลอยกระทง 3D'}</strong>
        <small>
          {platform === 'ios'
            ? <>แตะ <Share size={12} className="inline-share-icon" /> แชร์ใน Safari แล้วเลือก “เพิ่มไปยังหน้าจอโฮม”</>
            : installEvent
              ? 'ติดตั้งเพื่อเปิดใช้งานแบบแอป ไม่ต้องค้นหาเว็บทุกครั้ง'
              : 'เปิดเมนู ⋮ ใน Chrome แล้วเลือก “ติดตั้งแอป” หรือ “เพิ่มไปยังหน้าจอหลัก”'}
        </small>
      </div>
      {platform === 'android' && installEvent && <button className="pwa-install-action" onClick={install}>ติดตั้ง</button>}
      <button className="pwa-dismiss" onClick={dismiss} aria-label="ปิดคำแนะนำ"><X size={16} /></button>
    </aside>
  )
}
