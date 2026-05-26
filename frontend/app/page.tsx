'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ============================================================
   HOOKS
   ============================================================ */
interface RevealOptions {
  threshold?: number
  rootMargin?: string
}

function useReveal(options: RevealOptions = {}): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!ref.current || shown) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setShown(true); obs.disconnect() }
        })
      },
      { threshold: options.threshold ?? 0.18, rootMargin: options.rootMargin ?? '0px 0px -40px 0px' }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [shown, options.threshold, options.rootMargin])

  return [ref as any, shown]
}

interface CountUpOptions {
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
}

function useCountUp(
  target: number,
  { duration = 1500, decimals = 0, suffix = '', prefix = '' }: CountUpOptions = {},
  trigger = true
): string {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!trigger) return
    const start = performance.now()
    let raf: number
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setVal(target * ease(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target, duration])

  return prefix + val.toFixed(decimals) + suffix
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top, behavior: 'smooth' })
}

/* ============================================================
   ATOMS
   ============================================================ */
function LogoBox({ size = 32, light = false }: { size?: number; light?: boolean }) {
  return (
    <div
      className="shrink-0 r4"
      style={{
        width: size,
        height: size,
        border: `1px dashed ${light ? '#9ca3af' : '#0a0a0a'}`,
        display: 'inline-block',
      }}
      aria-label="Logo SIPEDULI"
    />
  )
}

type BadgeKind = 'tinggi' | 'sedang' | 'rendah'

function Badge({ kind = 'tinggi', children }: { kind?: BadgeKind; children: React.ReactNode }) {
  const styles: Record<BadgeKind, string> = {
    tinggi: 'bg-alert text-white',
    sedang: 'bg-ink text-white',
    rendah: 'bg-gray-200 text-ink',
  }
  return (
    <span className={`mono text-[11px] font-bold tracking-[0.08em] uppercase px-2 py-1 r4 ${styles[kind]}`}>
      {children}
    </span>
  )
}

function RedLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-alert text-[12px] font-bold tracking-[0.18em] uppercase ${className}`}>
      {children}
    </div>
  )
}

function PrimaryBtn({
  children,
  onClick,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`r4 inline-flex items-center justify-center bg-ink text-white font-bold text-[14px] tracking-[0.04em] uppercase px-5 py-3 hover:bg-black ${className}`}
    >
      {children}
    </button>
  )
}

function GhostBtn({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`r4 inline-flex items-center justify-center bg-white text-ink font-bold text-[14px] tracking-[0.04em] uppercase px-5 py-3 border border-ink hover:bg-gray-50 ${className}`}
    >
      {children}
    </button>
  )
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar({ onCTA, onTrack }: { onCTA: () => void; onTrack: () => void }) {
  const [open, setOpen] = useState(false)
  const link = 'text-[14px] text-ink hover:text-alert font-bold tracking-[0.02em]'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 headerDrop">
      <div className="max-w-[1240px] mx-auto px-6 h-[68px] flex items-center justify-between">
        <a
          href="#beranda"
          onClick={(e) => { e.preventDefault(); smoothScrollTo('beranda') }}
          className="flex items-center gap-3"
        >
          <LogoBox />
          <span className="font-bold tracking-[0.08em] text-[15px]">SIPEDULI</span>
          <span className="hidden md:inline mono text-[10px] tracking-[0.16em] uppercase text-gray-500 border-l border-gray-200 pl-3 ml-1">
            Sistem Pelaporan Kejahatan Terpadu
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {[
            ['beranda',    'Beranda'],
            ['cara-kerja', 'Cara Kerja'],
            ['cek-status', 'Cek Status'],
            ['faq',        'FAQ'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); smoothScrollTo(id) }}
              className={`${link} relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-alert after:w-0 hover:after:w-full after:transition-all after:duration-300`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden border border-ink p-2 r4"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className="block w-5 h-[2px] bg-ink mb-1" />
            <span className="block w-5 h-[2px] bg-ink mb-1" />
            <span className="block w-5 h-[2px] bg-ink" />
          </button>
          <PrimaryBtn onClick={onCTA} className="hidden sm:inline-flex btnPress">
            Laporkan Sekarang
          </PrimaryBtn>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
          {[
            ['beranda',    'Beranda'],
            ['cara-kerja', 'Cara Kerja'],
            ['cek-status', 'Cek Status'],
            ['faq',        'FAQ'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className={link} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

/* ============================================================
   HERO
   ============================================================ */
interface Ticket {
  id: string
  loc: string
  kind: BadgeKind
  label: string
  cat: string
}

function Hero({ onReport, onTrack }: { onReport: () => void; onTrack: () => void }) {
  const allTickets: Ticket[] = [
    { id: 'CRM-2025-0091', loc: 'Medan · baru saja',           kind: 'tinggi', label: 'TINGGI', cat: 'Penyerangan dengan senjata tajam' },
    { id: 'CRM-2025-0090', loc: 'Yogyakarta · 4 menit lalu',   kind: 'sedang', label: 'SEDANG', cat: 'Pencurian kendaraan bermotor' },
    { id: 'CRM-2025-0089', loc: 'Jakarta Pusat · 12 menit lalu', kind: 'tinggi', label: 'TINGGI', cat: 'Pencurian dengan kekerasan' },
    { id: 'CRM-2025-0088', loc: 'Bandung · 38 menit lalu',     kind: 'sedang', label: 'SEDANG', cat: 'Pengrusakan fasilitas umum' },
    { id: 'CRM-2025-0087', loc: 'Surabaya · 1 jam lalu',       kind: 'rendah', label: 'RENDAH', cat: 'Gangguan ketertiban' },
  ]

  const [start, setStart] = useState(2)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setStart((s) => (s - 1 + allTickets.length) % allTickets.length)
      setAnimKey((k) => k + 1)
    }, 4500)
    return () => clearInterval(t)
  }, [allTickets.length])

  const tickets = [0, 1, 2].map((i) => allTickets[(start + i) % allTickets.length])
  const [panelRef, panelIn] = useReveal({ threshold: 0.1 })

  return (
    <section id="beranda" className="bg-white">
      <div className="max-w-[1240px] mx-auto px-6 pt-16 md:pt-24 pb-20 md:pb-28 grid md:grid-cols-12 gap-10 items-start">
        {/* Left */}
        <div className="md:col-span-7 heroAnim">
          <RedLabel className="mb-6">
            <span className="redLabel">SISTEM PELAPORAN KEJAHATAN TERPADU</span>
          </RedLabel>
          <h1 className="font-bold leading-[0.98] tracking-[-0.02em] text-[64px] md:text-[88px]">
            Laporkan.<br />
            <span className="text-alert">Kami Tindak.</span>
          </h1>
          <p className="mt-7 text-gray-600 text-[17px] leading-[1.55] max-w-[560px]">
            Platform pelaporan kejahatan resmi yang terhubung langsung dengan aparat berwenang.
            Setiap laporan dianalisis dan diprioritaskan secara otomatis.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryBtn onClick={onReport}>Buat Laporan</PrimaryBtn>
            <GhostBtn onClick={onTrack}>Cek Status Laporan</GhostBtn>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[12px] text-gray-500">
            <span className="inline-block w-[6px] h-[6px] bg-gray-400" />
            Laporan bersifat rahasia. Identitas pelapor dilindungi.
          </div>

          {/* Trust strip */}
          <div className="mt-12 grid grid-cols-3 gap-0 border-y border-gray-200">
            {[
              ['ISO 27001', 'Keamanan data'],
              ['UU PDP',    'Patuh regulasi'],
              ['24/7',      'Operasional'],
            ].map(([k, v]) => (
              <div key={k} className="py-4 px-1 border-r last:border-r-0 border-gray-200">
                <div className="font-bold text-[13px] tracking-[0.08em]">{k}</div>
                <div className="mono text-[10px] uppercase tracking-[0.14em] text-gray-500 mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live ticket panel */}
        <div ref={panelRef} className={`md:col-span-5 reveal right ${panelIn ? 'in' : ''}`}>
          <div className="border border-gray-200 r4 bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="relative inline-block w-[8px] h-[8px]">
                  <span className="absolute inset-0 bg-alert" />
                  <span className="absolute inset-0 bg-alert livePulse" />
                </span>
                <span className="mono text-[11px] uppercase tracking-[0.16em] font-bold">
                  LIVE · LAPORAN MASUK
                </span>
              </div>
              <span className="mono text-[11px] text-gray-500">
                {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <ul>
              {tickets.map((t, i) => (
                <li
                  key={`${animKey}-${t.id}`}
                  className={`px-5 py-4 ticketIn ${i < tickets.length - 1 ? 'border-b border-gray-200' : ''}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-[13px] font-bold">{t.id}</span>
                    <Badge kind={t.kind}>{t.label}</Badge>
                  </div>
                  <div className="mt-1 text-[14px]">{t.cat}</div>
                  <div className="mt-1 mono text-[11px] uppercase tracking-[0.12em] text-gray-500">{t.loc}</div>
                </li>
              ))}
            </ul>

            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[12px] text-gray-500">Diperbarui otomatis setiap 30 detik</span>
              <a
                href="#cek-status"
                onClick={(e) => { e.preventDefault(); smoothScrollTo('cek-status') }}
                className="mono text-[11px] uppercase tracking-[0.16em] font-bold text-ink hover:text-alert"
              >
                LIHAT SEMUA →
              </a>
            </div>
          </div>

          {/* Secondary callout */}
          <div className="mt-4 border border-gray-200 r4 px-5 py-4 flex items-center justify-between lift">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.16em] text-gray-500">
                NOMOR DARURAT NASIONAL
              </div>
              <div className="font-bold text-[28px] text-alert leading-none mt-1 numPulse">110</div>
            </div>
            <div className="text-right text-[12px] text-gray-600 max-w-[180px]">
              Untuk situasi darurat yang mengancam nyawa, hubungi langsung kepolisian.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   STATS BAR
   ============================================================ */
function StatsBar() {
  const [ref, shown] = useReveal({ threshold: 0.4 })
  const v1 = useCountUp(47, { duration: 1400 }, shown)
  const v2 = useCountUp(12, { duration: 1200 }, shown)
  const v3 = useCountUp(94, { duration: 1600, suffix: '%' }, shown)

  const stats: [string, string][] = [
    [v1,     'Laporan masuk hari ini'],
    [v2,     'Prioritas tinggi aktif'],
    [v3,     'Tingkat penyelesaian'],
    ['< 2 Jam', 'Respons darurat'],
  ]

  return (
    <section ref={ref} className={`bg-ink text-white reveal up ${shown ? 'in' : ''}`}>
      <div className="max-w-[1240px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-y-8">
        {stats.map(([n, l], i) => (
          <div
            key={l}
            className={`px-2 ${i > 0 ? 'md:border-l md:border-white/15' : ''} ${i % 2 === 1 ? 'border-l border-white/15 md:border-l' : ''}`}
          >
            <div className="font-bold leading-none text-[40px] md:text-[44px] tracking-[-0.02em] tabular-nums">
              {n}
              {i === 3 && <span className="blink text-alert">_</span>}
            </div>
            <div className="mt-3 mono text-[11px] uppercase tracking-[0.16em] text-white/70">{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
function HowItWorks() {
  const steps = [
    {
      n: '01',
      t: 'Tulis laporan',
      d: 'Isi formulir aman dengan kronologi, lokasi, waktu, dan bukti pendukung. Anda dapat memilih melapor secara anonim atau dengan identitas terverifikasi.',
      meta: 'WAKTU: 3–5 MENIT',
    },
    {
      n: '02',
      t: 'AI menganalisis',
      d: 'Sistem klasifikasi otomatis menilai jenis kejahatan, urgensi, dan wilayah penanganan, lalu meneruskan laporan ke unit kepolisian yang tepat.',
      meta: 'PROSES: < 60 DETIK',
    },
    {
      n: '03',
      t: 'Polisi bertindak',
      d: 'Petugas yang ditugaskan menerima berkas lengkap dan melakukan tindak lanjut. Anda menerima pembaruan status di setiap tahap penyelidikan.',
      meta: 'TINJAU: 24 JAM',
    },
  ]

  const [headerRef, headerShown] = useReveal()
  const [gridRef, gridShown] = useReveal({ threshold: 0.12 })

  return (
    <section id="cara-kerja" className="bg-white">
      <div className="max-w-[1240px] mx-auto px-6 py-20 md:py-28">
        <div ref={headerRef} className={`max-w-[760px] reveal up ${headerShown ? 'in' : ''}`}>
          <RedLabel className="mb-5">
            <span className="redLabel">ALUR PELAPORAN</span>
          </RedLabel>
          <h2 className="font-bold text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.02em]">
            Tiga langkah mudah
          </h2>
          <p className="mt-5 text-gray-600 text-[16px] leading-[1.6] max-w-[600px]">
            Proses pelaporan dirancang singkat dan transparan agar siapa pun dapat melapor tanpa hambatan birokrasi.
          </p>
        </div>

        <div ref={gridRef} className="mt-14 grid md:grid-cols-3 border-y border-gray-200">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`p-8 md:p-10 reveal up ${gridShown ? 'in' : ''} ${i < steps.length - 1 ? 'md:border-r border-gray-200' : ''} ${i < steps.length - 1 ? 'border-b md:border-b-0 border-gray-200' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-baseline justify-between">
                <div className="text-alert font-bold text-[64px] md:text-[80px] leading-none tracking-[-0.04em] stepFlip">
                  {s.n}
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-gray-500">{s.meta}</div>
              </div>
              <div className="mt-6 font-bold text-[22px] tracking-[-0.01em]">{s.t}</div>
              <p className="mt-3 text-gray-600 text-[14.5px] leading-[1.6]">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   URGENCY SYSTEM
   ============================================================ */
function UrgencySystem() {
  const cards = [
    {
      border: '#cc0000',
      tag: 'TINGGI',
      title: 'PRIORITAS TINGGI',
      desc: 'Kejahatan dengan kekerasan, ancaman langsung terhadap nyawa, atau yang sedang berlangsung. Diteruskan ke unit reaksi cepat.',
      sla: 'Respons dalam 2 jam',
      examples: ['Penyerangan', 'Perampokan bersenjata', 'KDRT aktif'],
    },
    {
      border: '#0a0a0a',
      tag: 'SEDANG',
      title: 'PRIORITAS SEDANG',
      desc: 'Kejahatan terhadap harta benda atau pelanggaran serius tanpa risiko nyawa langsung. Ditugaskan ke unit reskrim wilayah.',
      sla: 'Respons dalam 24 jam',
      examples: ['Pencurian', 'Penipuan online', 'Pengrusakan'],
    },
    {
      border: '#9ca3af',
      tag: 'RENDAH',
      title: 'PRIORITAS RENDAH',
      desc: 'Pelanggaran ketertiban umum dan laporan informatif. Ditangani melalui kanal administratif dan patroli rutin.',
      sla: 'Respons dalam 72 jam',
      examples: ['Kebisingan', 'Parkir liar', 'Vandalisme ringan'],
    },
  ]

  const [headerRef, headerShown] = useReveal()
  const [cardsRef, cardsShown] = useReveal({ threshold: 0.12 })

  return (
    <section className="bg-gray-100">
      <div className="max-w-[1240px] mx-auto px-6 py-20 md:py-28">
        <div ref={headerRef} className={`grid md:grid-cols-12 gap-8 items-end reveal up ${headerShown ? 'in' : ''}`}>
          <div className="md:col-span-7">
            <RedLabel className="mb-5">
              <span className="redLabel">SISTEM PRIORITAS</span>
            </RedLabel>
            <h2 className="font-bold text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.02em]">
              Setiap laporan dinilai otomatis
            </h2>
          </div>
          <div className="md:col-span-5 text-gray-600 text-[15.5px] leading-[1.6]">
            Algoritma penilaian menggabungkan jenis tindak pidana, lokasi geografis, riwayat kasus serupa,
            dan tingkat ancaman untuk menentukan kelas prioritas.
          </div>
        </div>

        <div ref={cardsRef} className="mt-12 grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className={`bg-white r4 lift reveal up ${cardsShown ? 'in' : ''}`}
              style={{ borderTop: `3px solid ${c.border}`, transitionDelay: `${i * 0.12}s` }}
            >
              <div className="px-7 pt-7 pb-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="mono text-[11px] tracking-[0.16em] font-bold" style={{ color: c.border }}>
                    {c.tag}
                  </span>
                  <span className="mono text-[10px] tracking-[0.18em] uppercase text-gray-500">SLA</span>
                </div>
                <div className="mt-3 font-bold text-[22px] tracking-[-0.01em]">{c.title}</div>
              </div>
              <div className="px-7 py-6">
                <p className="text-gray-600 text-[14.5px] leading-[1.6]">{c.desc}</p>
                <div className="mt-6 mono text-[10px] uppercase tracking-[0.18em] text-gray-500">CONTOH KASUS</div>
                <ul className="mt-2 space-y-1">
                  {c.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-[14px]">
                      <span className="inline-block w-[6px] h-[6px] bg-ink" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-7 py-4 border-t border-gray-200 flex items-center justify-between">
                <span className="font-bold text-[14px]">{c.sla}</span>
                <span className="mono text-[11px] uppercase tracking-[0.18em] text-gray-500">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   STATUS TRACKER
   ============================================================ */
interface StatusEntry {
  stage: number
  kind: BadgeKind
  cat: string
  loc: string
  updated: string
  officer: string
}

const STATUS_DB: Record<string, StatusEntry> = {
  'CRM-2025-0089': { stage: 2, kind: 'tinggi', cat: 'Pencurian dengan kekerasan',   loc: 'Jakarta Pusat', updated: '12 menit lalu', officer: 'Polrestabes Jakpus · Unit IV' },
  'CRM-2025-0088': { stage: 1, kind: 'sedang', cat: 'Pengrusakan fasilitas umum',   loc: 'Bandung',       updated: '38 menit lalu', officer: 'Polrestabes Bandung · Reskrim' },
  'CRM-2025-0087': { stage: 3, kind: 'rendah', cat: 'Gangguan ketertiban',          loc: 'Surabaya',      updated: '1 jam lalu',    officer: 'Polsek Wonokromo' },
}

function Tracker() {
  const [q, setQ] = useState('CRM-2025-0089')
  const [active, setActive] = useState('CRM-2025-0089')
  const [error, setError] = useState('')
  const data = STATUS_DB[active]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const key = q.trim().toUpperCase()
    if (STATUS_DB[key]) { setActive(key); setError('') }
    else setError('Nomor laporan tidak ditemukan. Coba CRM-2025-0089.')
  }

  const steps = [
    { label: 'Diterima',     meta: 'Laporan tersimpan' },
    { label: 'Dianalisis',   meta: 'Klasifikasi AI' },
    { label: 'Penyelidikan', meta: 'Tindak lanjut polisi' },
    { label: 'Selesai',      meta: 'Berkas ditutup' },
  ]

  const [hdrRef, hdrShown] = useReveal()
  const [tlRef, tlShown]   = useReveal({ threshold: 0.25 })

  return (
    <section id="cek-status" className="bg-white">
      <div className="max-w-[1240px] mx-auto px-6 py-20 md:py-28">
        <div ref={hdrRef} className={`grid md:grid-cols-12 gap-8 items-end reveal up ${hdrShown ? 'in' : ''}`}>
          <div className="md:col-span-8">
            <RedLabel className="mb-5">
              <span className="redLabel">PELACAKAN LAPORAN</span>
            </RedLabel>
            <h2 className="font-bold text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.02em]">
              Cek status laporan Anda
            </h2>
          </div>
          <div className="md:col-span-4 text-gray-600 text-[15px] leading-[1.6]">
            Masukkan nomor laporan yang Anda terima saat pengiriman untuk melihat tahapan terkini.
          </div>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 border border-ink r4 flex flex-col md:flex-row focus-within:shadow-[0_0_0_3px_rgba(204,0,0,0.12)]"
        >
          <div className="flex-1 flex items-center px-5 py-4 gap-4">
            <span className="mono text-[11px] uppercase tracking-[0.18em] text-gray-500 hidden sm:inline">
              NO. LAPORAN
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Contoh: CRM-2025-0089"
              className="mono w-full bg-transparent text-[15px] font-bold tracking-[0.04em] outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-ink text-white font-bold text-[13px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-black"
          >
            Cek Status
          </button>
        </form>

        {error && (
          <div className="mt-3 mono text-[12px] text-alert uppercase tracking-[0.12em]">{error}</div>
        )}

        {/* Result panel */}
        <div className="mt-10 border border-gray-200 r4 bg-white">
          <div className="grid md:grid-cols-4 border-b border-gray-200">
            {([
              ['NO. LAPORAN', <span key="id" className="mono font-bold">{active}</span>],
              ['JENIS',       data.cat],
              ['LOKASI',      data.loc],
              ['DIPERBARUI',  data.updated],
            ] as [string, React.ReactNode][]).map(([k, v], i) => (
              <div
                key={k}
                className={`px-6 py-5 ${i < 3 ? 'md:border-r border-gray-200' : ''} ${i < 3 ? 'border-b md:border-b-0 border-gray-200' : ''}`}
              >
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-gray-500">{k}</div>
                <div className="mt-2 font-bold text-[15px]">{v}</div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div
            ref={tlRef}
            className={`px-6 md:px-10 py-10 reveal up ${tlShown ? 'in' : ''}`}
            style={{ '--tl': `${data.stage / 3}` } as React.CSSProperties}
          >
            <div className="grid grid-cols-4 gap-3 relative">
              <div
                className="absolute left-0 right-0 top-[12px] h-px bg-gray-200"
                style={{ marginLeft: 'calc(12.5% + 14px)', marginRight: 'calc(12.5% + 14px)' }}
              />
              <div
                className="tlBar"
                style={{ left: 'calc(12.5% + 14px)', right: 'calc(12.5% + 14px)', width: 'auto' }}
              />
              {steps.map((s, i) => {
                const filled  = i < data.stage
                const current = i === data.stage
                let bg = '#ffffff', border = '#9ca3af', mark = ''
                if (filled)  { bg = '#0a0a0a'; border = '#0a0a0a'; mark = '✓' }
                if (current) { bg = '#cc0000'; border = '#cc0000'; mark = '●' }
                const labelColor = filled || current ? '#0a0a0a' : '#9ca3af'
                return (
                  <div key={s.label} className="flex flex-col items-center text-center px-2 relative z-10">
                    <div
                      className={`w-[28px] h-[28px] r4 flex items-center justify-center text-white text-[12px] font-bold transition-all duration-500 ${current ? 'ringPulse' : ''}`}
                      style={{ background: bg, border: `2px solid ${border}` }}
                    >
                      <span style={{ color: filled ? '#ffffff' : (current ? '#ffffff' : 'transparent') }}>
                        {mark}
                      </span>
                    </div>
                    <div className="mt-3 font-bold text-[14px]" style={{ color: labelColor }}>{s.label}</div>
                    <div className="mt-1 mono text-[10px] uppercase tracking-[0.14em] text-gray-500">{s.meta}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-0 border-t border-gray-200 pt-6">
              <div className="md:pr-6">
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-gray-500">PETUGAS PENANGANAN</div>
                <div className="mt-2 font-bold text-[15px]">{data.officer}</div>
              </div>
              <div className="md:px-6 md:border-l border-gray-200 mt-6 md:mt-0">
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-gray-500">PRIORITAS</div>
                <div className="mt-2">
                  <Badge kind={data.kind}>
                    {data.kind === 'tinggi' ? 'TINGGI' : data.kind === 'sedang' ? 'SEDANG' : 'RENDAH'}
                  </Badge>
                </div>
              </div>
              <div className="md:pl-6 md:border-l border-gray-200 mt-6 md:mt-0">
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-gray-500">TINDAKAN ANDA</div>
                <div className="mt-2 font-bold text-[15px]">Tambahkan informasi atau bukti baru</div>
                <button className="mt-2 mono text-[11px] uppercase tracking-[0.18em] font-bold underline underline-offset-4">
                  UNGGAH BUKTI →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sample IDs */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-gray-500">CONTOH:</span>
          {Object.keys(STATUS_DB).map((id) => (
            <button
              key={id}
              onClick={() => { setQ(id); setActive(id); setError('') }}
              className={`mono text-[12px] font-bold px-3 py-1 r4 border ${active === id ? 'bg-ink text-white border-ink' : 'border-gray-300 hover:border-ink'}`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FAQ
   ============================================================ */
function FAQ() {
  const items = [
    { q: 'Apakah identitas saya dilindungi?',       a: 'Ya. Anda dapat melapor secara anonim. Jika Anda memberikan identitas, data tersebut dienkripsi dan hanya dapat diakses oleh petugas berwenang sesuai UU Perlindungan Data Pribadi.' },
    { q: 'Berapa lama proses penanganan laporan?',  a: 'Tergantung tingkat prioritas: 2 jam untuk tinggi, 24 jam untuk sedang, dan 72 jam untuk rendah. Anda akan menerima pembaruan setiap kali status berubah.' },
    { q: 'Apa bedanya dengan menelepon 110?',        a: 'Untuk situasi darurat yang sedang berlangsung, hubungi 110. SIPEDULI ditujukan untuk laporan terstruktur dengan bukti yang dapat ditelusuri dan dipantau pelapor.' },
    { q: 'Bisakah saya melampirkan foto atau video?', a: 'Bisa. Anda dapat mengunggah hingga 10 berkas (foto, video, atau dokumen) per laporan dengan total ukuran maksimum 200 MB.' },
    { q: 'Bagaimana laporan palsu ditangani?',       a: 'Sistem mendeteksi pola laporan palsu dan menandainya untuk peninjauan manual. Pelaporan palsu yang disengaja dapat dikenakan sanksi sesuai pasal 220 KUHP.' },
    { q: 'Apakah layanan ini gratis?',              a: 'Sepenuhnya gratis. SIPEDULI dibiayai oleh negara dan tidak mengenakan biaya apa pun kepada pelapor.' },
  ]

  const [open, setOpen] = useState(0)
  const [hdrRef,  hdrShown]  = useReveal()
  const [listRef, listShown] = useReveal({ threshold: 0.1 })

  return (
    <section id="faq" className="bg-white border-t border-gray-200">
      <div className="max-w-[1240px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-12 gap-12">
        <div ref={hdrRef} className={`md:col-span-4 reveal up ${hdrShown ? 'in' : ''}`}>
          <RedLabel className="mb-5">
            <span className="redLabel">PERTANYAAN UMUM</span>
          </RedLabel>
          <h2 className="font-bold text-[40px] md:text-[48px] leading-[1.02] tracking-[-0.02em]">
            Hal yang sering ditanyakan
          </h2>
          <p className="mt-5 text-gray-600 text-[15px] leading-[1.6]">
            Tidak menemukan jawabannya? Hubungi pusat bantuan di
            <span className="mono font-bold"> bantuan@sipeduli.go.id</span>.
          </p>
        </div>

        <div ref={listRef} className="md:col-span-8 border-t border-gray-200">
          {items.map((it, i) => (
            <div
              key={i}
              className={`border-b border-gray-200 reveal up ${listShown ? 'in' : ''}`}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <button
                className="w-full text-left flex items-start justify-between gap-6 py-6 hover:text-alert"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <div className="flex items-start gap-5">
                  <span className="mono text-[12px] font-bold text-gray-400 mt-1">0{i + 1}</span>
                  <span className="font-bold text-[18px] tracking-[-0.01em]">{it.q}</span>
                </div>
                <span
                  className="mono text-[18px] font-bold shrink-0 transition-transform duration-300"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0)' }}
                >
                  {open === i ? '−' : '+'}
                </span>
              </button>
              <div className={`faqBody ${open === i ? 'open' : ''}`}>
                <div>
                  <div className="pb-6 pl-[44px] pr-10 text-gray-600 text-[15px] leading-[1.65] max-w-[640px]">
                    {it.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const layanan    = ['Buat Laporan', 'Cek Status', 'Lapor Anonim', 'Unggah Bukti']
  const informasi  = ['Tentang SIPEDULI', 'Kebijakan Privasi', 'Syarat Layanan', 'Aksesibilitas']

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-[1240px] mx-auto px-6 pt-20 pb-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <LogoBox light />
            <span className="font-bold tracking-[0.08em] text-[15px]">SIPEDULI</span>
          </div>
          <p className="mt-5 text-white/70 text-[14px] leading-[1.6] max-w-[320px]">
            Sistem Pelaporan Kejahatan Terpadu — kanal resmi pelaporan warga yang terhubung langsung dengan kepolisian.
          </p>
          <p className="mt-4 mono text-[11px] uppercase tracking-[0.16em] text-white/40 max-w-[320px] leading-[1.6]">
            Disclaimer: SIPEDULI bukan pengganti panggilan darurat. Untuk situasi mengancam nyawa, hubungi 110.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-white/50">LAYANAN</div>
          <ul className="mt-4 space-y-3">
            {layanan.map((l) => (
              <li key={l}><a href="#" className="text-[14px] hover:text-alert">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-white/50">INFORMASI</div>
          <ul className="mt-4 space-y-3">
            {informasi.map((l) => (
              <li key={l}><a href="#" className="text-[14px] hover:text-alert">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-white/50">DARURAT? HUBUNGI</div>
          <div className="mt-3 font-bold text-alert text-[88px] leading-none tracking-[-0.04em] numPulse">110</div>
          <div className="mt-3 text-white/70 text-[13px] leading-[1.6] max-w-[300px]">
            Layanan panggilan darurat kepolisian, 24 jam tanpa biaya, di seluruh Indonesia.
          </div>
          <div className="mt-5 flex items-center gap-3">
            <span className="mono text-[11px] uppercase tracking-[0.16em] text-white/50">SMS Pengaduan</span>
            <span className="mono font-bold text-[14px]">1717</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1240px] mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              © 2025 SIPEDULI · Sistem Pelaporan Kejahatan Terpadu · Republik Indonesia
            </div>
            <a
              href="/admin/login"
              className="mono text-[11px] uppercase tracking-[0.16em] text-white/30 hover:text-white/60 mt-1 inline-block"
            >
              Portal Petugas →
            </a>
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.16em] text-white/50">
            VERSI 2.4.1 · STATUS: OPERASIONAL
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   PAGE (default export — Next.js App Router entry point)
   ============================================================ */
export default function Page() {
  const router = useRouter()

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 60
    window.scrollTo({ top, behavior: 'auto' })
  }

  const trackerRef = () => scrollToId('cek-status')
  const reportRef  = () => router.push('/laporan')

  return (
    <div className="bg-white">
      <Navbar   onCTA={reportRef}   onTrack={trackerRef} />
      <Hero     onReport={reportRef} onTrack={trackerRef} />
      <StatsBar />
      <HowItWorks />
      <UrgencySystem />
      <Tracker />
      <FAQ />
      <Footer />
    </div>
  )
}
