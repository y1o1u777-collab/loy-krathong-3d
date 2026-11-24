import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown,
  Flower2, Flame, Heart, Info, Leaf, Moon, Rotate3D, Send, Sparkles,
  Waves, X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import RiverCanvas from './components/RiverCanvas'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { useKrathongs } from './hooks/useKrathongs'
import { BASE_OPTIONS, FLOWER_OPTIONS } from './types'
import type { BaseType, FlowerType, Krathong, KrathongDraft } from './types'
import { isSupabaseConfigured } from './lib/supabase'

type Page = 'home' | 'create' | 'launch' | 'river'

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(7px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -12, filter: 'blur(5px)', transition: { duration: 0.28 } },
}

function Brand() {
  return (
    <div className="brand-mark">
      <div className="brand-symbol"><Moon size={19} fill="currentColor" /><Sparkles size={11} /></div>
      <div className="brand-type"><strong>ลอยกระทง <span>3D</span></strong><small>THE NIGHT OF WISHES</small></div>
    </div>
  )
}

function Header({ page, go }: { page: Page; go: (next: Page) => void }) {
  return (
    <header className="topbar">
      <button className="brand-button" onClick={() => go('home')} aria-label="กลับหน้าหลัก"><Brand /></button>
      <nav className="desktop-nav">
        <button className={page === 'home' ? 'nav-active' : ''} onClick={() => go('home')}>หน้าหลัก</button>
        <button className={page === 'create' || page === 'launch' ? 'nav-active' : ''} onClick={() => go('create')}>สร้างกระทง</button>
        <button className={page === 'river' ? 'nav-active' : ''} onClick={() => go('river')}>แม่น้ำชุมชน</button>
      </nav>
      <button className="top-cta" onClick={() => go('create')}><Sparkles size={15} /> เริ่มสร้างกระทง</button>
    </header>
  )
}

function PrimaryButton({ children, onClick, disabled = false, type = 'button' }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'
}) {
  return (
    <button className="primary-button" onClick={onClick} disabled={disabled} type={type}>
      <span>{children}</span><ArrowRight size={17} />
    </button>
  )
}

function SectionEyebrow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="eyebrow"><span>{icon}</span>{children}</div>
}

function HomePage({ go, count }: { go: (page: Page) => void; count: number }) {
  return (
    <motion.main className="home-page page-shell" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="hero-copy">
        <SectionEyebrow icon={<Sparkles size={14} />}>A MAGICAL THAI FESTIVAL EXPERIENCE</SectionEyebrow>
        <h1>คืนแห่งแสงอธิษฐาน<br /><span>ลอยกระทง 3D</span></h1>
        <p className="hero-lead">สร้างกระทงในแบบของคุณ จุดแสงแห่งความหวัง
          แล้วปล่อยทุกคำอธิษฐานให้ล่องลอยไปกับสายน้ำ</p>
        <div className="hero-actions">
          <PrimaryButton onClick={() => go('create')}>เริ่มสร้างและลอยกระทง</PrimaryButton>
          <button className="secondary-button" onClick={() => go('river')}><Waves size={17} /> ดูแม่น้ำกระทงทั้งหมด</button>
        </div>
        <div className="hero-footnote"><span className="live-dot" /> <strong>{count.toLocaleString('th-TH')}</strong> กระทงร่วมส่งคำอธิษฐาน <span className="foot-divider">•</span> ทุกคำอธิษฐานมีความหมาย</div>
      </div>
      <div className="hero-visual">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="moon-label"><span /> FULL MOON · LOY KRATHONG NIGHT</div>
        <div className="hero-canvas"><RiverCanvas mode="showcase" /></div>
        <div className="visual-caption"><span className="caption-line" /><div><strong>แสงเทียนหนึ่งดวง</strong><small>แทนหนึ่งความหวังที่กำลังเดินทาง</small></div></div>
        <div className="float-note note-top"><Sparkles size={14} /> Make a wish</div>
        <div className="float-note note-bottom"><span className="mini-flame" /> Your light, your story</div>
      </div>
      <div className="home-bottom-grid">
        <div className="feature-item"><div className="feature-icon"><Rotate3D size={18} /></div><div><strong>ออกแบบได้ 360°</strong><small>หมุนชมกระทงได้รอบทิศทาง</small></div></div>
        <div className="feature-item"><div className="feature-icon"><Flame size={18} /></div><div><strong>แสงเทียนมีชีวิต</strong><small>เปลวไฟและแสงสะท้อนแบบ 3D</small></div></div>
        <div className="feature-item"><div className="feature-icon"><Heart size={18} /></div><div><strong>ส่งคำอธิษฐาน</strong><small>ร่วมลอยกระทงไปกับทุกคน</small></div></div>
      </div>
    </motion.main>
  )
}

function ChoiceCard({ selected, color, title, detail, onClick, icon }: {
  selected: boolean; color: string; title: string; detail: string; onClick: () => void; icon: ReactNode
}) {
  return (
    <button type="button" className={`choice-card ${selected ? 'choice-selected' : ''}`} onClick={onClick}>
      <span className="choice-swatch" style={{ background: color }}>{icon}</span>
      <span className="choice-copy"><strong>{title}</strong><small>{detail}</small></span>
      <span className="choice-check">{selected && <Check size={12} />}</span>
    </button>
  )
}

function CreatePage({
  baseType, setBaseType, flowerType, setFlowerType, name, setName, wish, setWish,
  onSubmit, busy, onBack,
}: {
  baseType: BaseType; setBaseType: (value: BaseType) => void;
  flowerType: FlowerType; setFlowerType: (value: FlowerType) => void;
  name: string; setName: (value: string) => void; wish: string; setWish: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void; busy: boolean; onBack: () => void;
}) {
  return (
    <motion.main className="create-page page-shell" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-heading">
        <button className="back-link" onClick={onBack}><ArrowLeft size={16} /> กลับหน้าหลัก</button>
        <SectionEyebrow icon={<Sparkles size={14} />}>YOUR PERSONAL KRATHONG</SectionEyebrow>
        <h2>สร้างกระทง<span>ในแบบของคุณ</span></h2>
        <p>เลือกองค์ประกอบที่ชอบ เติมคำอธิษฐาน แล้วให้แสงเล็ก ๆ ของคุณเริ่มเดินทาง</p>
      </div>
      <form className="builder-layout" onSubmit={onSubmit}>
        <section className="builder-controls glass-panel">
          <div className="step-heading"><span className="step-number">01</span><div><strong>ออกแบบกระทง</strong><small>เลือกฐานและดอกไม้ที่คุณชื่นชอบ</small></div></div>
          <div className="control-block">
            <div className="control-label"><Leaf size={15} /><strong>รูปแบบฐานกระทง</strong><span>เลือก 1 แบบ</span></div>
            <div className="choice-grid">
              {BASE_OPTIONS.map((option) => <ChoiceCard key={option.id} selected={baseType === option.id} color={option.color} title={option.name} detail={option.detail} onClick={() => setBaseType(option.id)} icon={<Leaf size={19} />} />)}
            </div>
          </div>
          <div className="control-divider" />
          <div className="control-block">
            <div className="control-label"><Flower2 size={15} /><strong>ดอกไม้ตรงกลาง</strong><span>เลือก 1 แบบ</span></div>
            <div className="choice-grid">
              {FLOWER_OPTIONS.map((option) => <ChoiceCard key={option.id} selected={flowerType === option.id} color={option.color} title={option.name} detail={option.detail} onClick={() => setFlowerType(option.id)} icon={<Flower2 size={19} />} />)}
            </div>
          </div>
          <div className="control-divider" />
          <div className="step-heading step-two"><span className="step-number">02</span><div><strong>ฝากข้อความจากหัวใจ</strong><small>ข้อความของคุณจะลอยไปพร้อมกระทง</small></div></div>
          <label className="field-label" htmlFor="sender">ชื่อผู้ลอยกระทง</label>
          <input id="sender" className="text-field" value={name} onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)} placeholder="พิมพ์ชื่อของคุณ..." maxLength={40} required />
          <label className="field-label" htmlFor="wish">คำอวยพร / คำอธิษฐาน</label>
          <textarea id="wish" className="text-field wish-field" value={wish} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setWish(event.target.value)} placeholder="ขอให้สิ่งดี ๆ ล่องลอยเข้ามาในชีวิต..." maxLength={180} rows={3} required />
          <div className="form-bottom"><span>{wish.length}/180 ตัวอักษร</span><button className="primary-button submit-button" type="submit" disabled={busy || !name.trim() || !wish.trim()}><span>{busy ? 'กำลังปล่อยกระทง...' : 'ยืนยันและลอยกระทง'}</span><Send size={16} /></button></div>
          <div className="privacy-note"><Info size={13} /> ชื่อและคำอธิษฐานจะแสดงในแม่น้ำชุมชน</div>
        </section>
        <aside className="preview-column">
          <div className="preview-card glass-panel">
            <div className="preview-heading"><div><span className="preview-kicker">LIVE PREVIEW</span><strong>กระทงของคุณ</strong></div><span className="preview-badge"><span /> 3D MODEL</span></div>
            <div className="preview-canvas"><RiverCanvas mode="preview" baseType={baseType} flowerType={flowerType} /></div>
            <div className="preview-hint"><Rotate3D size={14} /> ลากเพื่อหมุน · เลื่อนเพื่อซูม</div>
            <div className="preview-meta"><div><small>ฐานกระทง</small><strong>{BASE_OPTIONS.find((item) => item.id === baseType)?.name}</strong></div><div><small>ดอกไม้</small><strong>{FLOWER_OPTIONS.find((item) => item.id === flowerType)?.name}</strong></div></div>
          </div>
          <div className="wish-quote"><span>“</span><p>ทุกแสงเทียนมีเรื่องราว<br />และทุกคำอธิษฐานมีความหมาย</p><small>— LOY KRATHONG NIGHT —</small></div>
        </aside>
      </form>
    </motion.main>
  )
}

function LaunchPage({ krathong, onCommunity }: { krathong: Krathong; onCommunity: () => void }) {
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setFinished(true), 7000)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <motion.main className="launch-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="launch-canvas"><RiverCanvas mode="launch" baseType={krathong.base_type} flowerType={krathong.flower_type} /></div>
      <div className="launch-overlay" />
      <div className="launch-copy">
        <SectionEyebrow icon={<Sparkles size={14} />}>A WISH SET SAIL</SectionEyebrow>
        <h2>{finished ? 'คำอธิษฐานของคุณ' : 'ปล่อยใจไปกับสายน้ำ'}</h2>
        <p className="launch-name">{krathong.sender_name}</p>
        <blockquote>“{krathong.wish_message}”</blockquote>
        {!finished ? <div className="launch-loading"><span /><span /><span /> กระทงกำลังลอยสู่สายน้ำ</div> : <div className="launch-finished"><span><Check size={15} /></span> กระทงของคุณลอยอยู่ในแม่น้ำแล้ว <PrimaryButton onClick={onCommunity}>ไปดูกระทงที่ลอยในแม่น้ำ</PrimaryButton></div>}
      </div>
      <div className="launch-bottom-note"><Moon size={14} /> ขอให้ทุกคำอธิษฐานเดินทางไปถึงดวงดาว</div>
    </motion.main>
  )
}

function RiverPage({ items, loading, isLive, error, selected, setSelected, onCreate, onHome }: {
  items: Krathong[]; loading: boolean; isLive: boolean; error: string | null;
  selected: Krathong | null; setSelected: (item: Krathong | null) => void;
  onCreate: () => void; onHome: () => void;
}) {
  const displayItems = items.slice(0, 18)
  return (
    <motion.main className="river-page page-shell" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="river-heading">
        <div><button className="back-link" onClick={onHome}><ArrowLeft size={16} /> กลับหน้าหลัก</button><SectionEyebrow icon={<Waves size={14} />}>COMMUNITY RIVER · LIVE</SectionEyebrow><h2>แม่น้ำแห่ง<span>คำอธิษฐาน</span></h2><p>ทุกกระทงมีเรื่องราว ทุกแสงเทียนคือความหวังที่เราแบ่งปันกัน</p></div>
        <div className="river-counter"><span className="live-dot" /><strong>{items.length.toLocaleString('th-TH')}</strong><small>กระทงในแม่น้ำ</small></div>
      </div>
      <div className="river-stage-wrap">
        <div className="river-stage"><RiverCanvas mode="river" items={displayItems} selectedId={selected?.id} onSelect={setSelected} />
          <div className="river-stage-top"><span className="live-pill"><span /> {isLive ? 'LIVE · SUPABASE REALTIME' : 'DEMO RIVER · LOCAL MODE'}</span><span className="river-tip"><Rotate3D size={13} /> ลากเพื่อหมุนมุมมอง · คลิกกระทงเพื่ออ่านคำอธิษฐาน</span></div>
          <div className="river-stage-bottom"><span><Moon size={14} /> ใต้แสงจันทร์คืนนี้</span><span>{displayItems.length} กระทงที่แสดง</span></div>
        </div>
        <aside className="river-sidebar glass-panel">
          <div className="sidebar-title"><div><span className="preview-kicker">WISHES ON WATER</span><strong>คำอธิษฐานล่าสุด</strong></div><span className="sidebar-count">{items.length}</span></div>
          {selected && <div className="selected-wish"><button className="close-selected" onClick={() => setSelected(null)} aria-label="ปิด"><X size={14} /></button><span className="selected-label">SELECTED KRATHONG</span><strong>{selected.sender_name}</strong><p>“{selected.wish_message}”</p><small>{new Date(selected.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</small></div>}
          <div className="wish-list">
            {loading && <div className="empty-state">กำลังเรียกคำอธิษฐาน...</div>}
            {!loading && displayItems.length === 0 && <div className="empty-state">ยังไม่มีกระทงในแม่น้ำ<br />มาเป็นคนแรกที่ส่งคำอธิษฐานกัน</div>}
            {displayItems.slice(0, 8).map((item) => (
              <button key={item.id} className={`wish-list-item ${selected?.id === item.id ? 'wish-item-active' : ''}`} onClick={() => setSelected(item)}>
                <span className="wish-bullet"><Flame size={14} /></span><span className="wish-item-copy"><strong>{item.sender_name}</strong><small>{item.wish_message}</small></span><ArrowDownRight size={14} />
              </button>
            ))}
          </div>
          {error && <div className="error-note">เชื่อมต่อข้อมูลไม่สำเร็จ: {error}</div>}
          <div className="sidebar-bottom"><div><strong>ส่งแสงของคุณร่วมกับเรา</strong><small>คำอธิษฐานเล็ก ๆ อาจสร้างความหมายที่ยิ่งใหญ่</small></div><button className="sidebar-create" onClick={onCreate}><Sparkles size={15} /> สร้างกระทง</button></div>
        </aside>
      </div>
      <div className="river-footnote"><span><span className="live-dot" /> อัปเดตคำอธิษฐานอัตโนมัติ</span><span>แสดงกระทงล่าสุดสูงสุด 18 ใบในฉาก 3D</span></div>
    </motion.main>
  )
}

function Footer({ go }: { go: (page: Page) => void }) {
  return <footer className="site-footer"><span>© 2026 LOY KRATHONG 3D</span><span>สร้างด้วยความตั้งใจ <Heart size={12} fill="currentColor" /></span><button onClick={() => go('home')}>กลับด้านบน <ChevronDown size={12} className="footer-chevron" /></button></footer>
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [baseType, setBaseType] = useState<BaseType>('banana')
  const [flowerType, setFlowerType] = useState<FlowerType>('marigold')
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [lastCreated, setLastCreated] = useState<Krathong | null>(null)
  const [selected, setSelected] = useState<Krathong | null>(null)
  const { krathongs, loading, error, add, isLive } = useKrathongs()

  const go = (next: Page) => {
    setPage(next)
    if (next !== 'river') setSelected(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !wish.trim()) return
    setBusy(true)
    try {
      const draft: KrathongDraft = { sender_name: name.trim(), wish_message: wish.trim(), base_type: baseType, flower_type: flowerType }
      const created = await add(draft)
      setLastCreated(created)
      setPage('launch')
      setToast(isSupabaseConfigured ? 'บันทึกกระทงลงแม่น้ำเรียบร้อยแล้ว' : 'สร้างกระทงแล้ว · โหมดทดลองในเครื่อง')
      setName('')
      setWish('')
    } catch (err) {
      setToast(err instanceof Error ? `บันทึกไม่สำเร็จ: ${err.message}` : 'เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4300)
    return () => window.clearTimeout(timer)
  }, [toast])

  const communityCount = useMemo(() => krathongs.length, [krathongs.length])

  return (
    <div className="app-root">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      {page !== 'launch' && <Header page={page} go={go} />}
      <AnimatePresence mode="wait">
        {page === 'home' && <HomePage key="home" go={go} count={communityCount} />}
        {page === 'create' && <CreatePage key="create" baseType={baseType} setBaseType={setBaseType} flowerType={flowerType} setFlowerType={setFlowerType} name={name} setName={setName} wish={wish} setWish={setWish} onSubmit={handleSubmit} busy={busy} onBack={() => go('home')} />}
        {page === 'launch' && lastCreated && <LaunchPage key={`launch-${lastCreated.id}`} krathong={lastCreated} onCommunity={() => go('river')} />}
        {page === 'river' && <RiverPage key="river" items={krathongs} loading={loading} isLive={isLive} error={error} selected={selected} setSelected={setSelected} onCreate={() => go('create')} onHome={() => go('home')} />}
      </AnimatePresence>
      {page !== 'launch' && <Footer go={go} />}
      <PWAInstallPrompt />
      <AnimatePresence>
        {toast && <motion.div className="toast-message" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><Check size={15} /> {toast}<button onClick={() => setToast(null)}><X size={13} /></button></motion.div>}
      </AnimatePresence>
    </div>
  )
}
