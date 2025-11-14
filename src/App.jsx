import React, { useMemo, useRef, useState } from 'react'
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion'

const IMAGES = [
  {
    id: 'look-1',
    url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
    alt: 'Linen shirt in soft beige',
    tone: 'from-white to-amber-50'
  },
  {
    id: 'look-2',
    url: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
    alt: 'Minimal trench coat',
    tone: 'from-amber-50 to-stone-50'
  },
  {
    id: 'look-3',
    url: 'https://images.unsplash.com/photo-1520975693410-001d6025f660?q=80&w=1200&auto=format&fit=crop',
    alt: 'Cotton tee and trousers',
    tone: 'from-stone-50 to-amber-50'
  },
  {
    id: 'look-4',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    alt: 'Pastel brown knit',
    tone: 'from-amber-50 to-white'
  }
]

function Navbar() {
  const links = ['Home', 'Collection', 'New Arrivals', 'Contact']
  return (
    <div className="w-full flex items-center justify-between py-4 px-6 md:px-10">
      <div className="text-xl md:text-2xl tracking-wide font-semibold text-stone-800">Upsarg</div>
      <nav className="hidden sm:flex items-center gap-6 text-stone-700">
        {links.map((l) => (
          <a key={l} href="#" className="group relative font-medium">
            <span>{l}</span>
            <span className="block h-[2px] bg-stone-800/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </a>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  const [current, setCurrent] = useState(0)
  const audioCtxRef = useRef(null)

  const next = () => {
    // subtle click using WebAudio (optional, graceful if blocked)
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext
        audioCtxRef.current = Ctx ? new Ctx() : null
      }
      const ctx = audioCtxRef.current
      if (ctx) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.setValueAtTime(660, ctx.currentTime)
        g.gain.setValueAtTime(0.0001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15)
        o.connect(g)
        g.connect(ctx.destination)
        o.start()
        o.stop(ctx.currentTime + 0.16)
      }
    } catch {}
    setCurrent((c) => (c + 1) % IMAGES.length)
  }

  const select = (idx) => setCurrent(idx)
  const active = IMAGES[current]

  // Responsive decision for sidebar layout
  const sidebarCols = useMemo(() => ({ base: 3, md: 1 }), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-stone-50 text-stone-900">
      <LayoutGroup>
        <Navbar />

        <div className="mx-auto max-w-7xl px-4 md:px-8 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 md:gap-10 items-start">
            {/* Main Showcase */}
            <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-stone-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] min-h-[55vh] md:min-h-[70vh] flex items-center justify-center">
              {/* Soft background vignette */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${active.tone}`} />

              {/* Main image with smooth transition */}
              <div className="relative w-full h-full flex items-center justify-center p-6 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    className="relative"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <motion.img
                      layoutId={`image-${active.id}`}
                      src={active.url}
                      alt={active.alt}
                      className="max-h-[52vh] md:max-h-[64vh] w-auto rounded-2xl shadow-xl object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Premium circular button */}
              <motion.button
                onClick={next}
                className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-white to-amber-100 border border-amber-200 shadow-[0_8px_30px_rgba(214,161,84,0.25)] flex items-center justify-center text-sm font-semibold text-stone-700"
                whileHover={{ boxShadow: '0 0 0 8px rgba(214,161,84,0.15)', scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                aria-label="Next look"
                title="Next look"
              >
                <div className="flex flex-col items-center">
                  <span className="text-base md:text-lg">Next</span>
                  <span className="text-[10px] md:text-xs opacity-70">0{current + 1} / 0{IMAGES.length}</span>
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-full bg-white/40 blur-xl opacity-0 hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            {/* Right Side Panel (Upsarg Section) */}
            <div className="md:sticky md:top-6">
              <div className="mb-4 md:mb-6">
                <h3 className="text-lg font-semibold tracking-wide text-stone-800">Curated Looks</h3>
                <p className="text-sm text-stone-500">Tap a tile to bring it center stage.</p>
              </div>

              {/* Desktop vertical stack / Mobile grid */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                {IMAGES.map((img, idx) => (
                  <motion.button
                    key={img.id}
                    onClick={() => select(idx)}
                    className={`relative overflow-hidden rounded-2xl bg-white border ${
                      idx === current ? 'border-stone-300' : 'border-stone-200'
                    } shadow-[0_6px_18px_rgba(0,0,0,0.06)] group`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    aria-label={`Select ${img.alt}`}
                  >
                    <motion.img
                      layoutId={`image-${img.id}`}
                      src={img.url}
                      alt={img.alt}
                      className="h-28 md:h-32 w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    {/* Glow on active */}
                    {idx === current && (
                      <span className="pointer-events-none absolute inset-0 ring-2 ring-amber-300/60 rounded-2xl" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mobile: thumbs bar under main (hidden on md) */}
          </div>
        </div>
      </LayoutGroup>
    </div>
  )
}
