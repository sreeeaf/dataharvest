import { useCallback, useEffect, useRef, useState } from 'react'
import { formatBits } from '../../lib/format'

interface FloatingText {
  id: number
  value: number
  x: number
}

function FloatingTexts({ floats }: { floats: Array<FloatingText> }) {
  return (
    <>
      {floats.map((f) => (
        <span
          key={f.id}
          className="floating-text absolute top-2 text-matrix-green font-semibold text-sm pointer-events-none whitespace-nowrap"
          style={{ left: `${f.x}%` }}
        >
          +{formatBits(f.value)}
        </span>
      ))}
    </>
  )
}

export default function HarvestButton({
  clickValue,
  onHarvest,
}: {
  clickValue: number
  onHarvest: () => void
}) {
  const [floats, setFloats] = useState<Array<FloatingText>>([])
  const [mainVisible, setMainVisible] = useState(true)
  const nextId = useRef(0)
  const mainRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setMainVisible(entry.isIntersecting),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleClick = useCallback(() => {
    onHarvest()
    const id = nextId.current++
    const x = 30 + Math.random() * 40
    setFloats((prev) => [...prev, { id, value: clickValue, x }])
    window.setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id))
    }, 900)
  }, [clickValue, onHarvest])

  return (
    <div className="relative flex flex-col items-center gap-3">
      <button
        ref={mainRef}
        onClick={handleClick}
        className="relative h-36 w-36 rounded-full border-2 border-matrix-green bg-matrix-panel text-matrix-green pulse-glow transition-transform active:scale-95 hover:bg-matrix-green/10 select-none"
      >
        <span className="text-sm tracking-widest">RÉCOLTER</span>
        <span className="block text-xs text-matrix-green-dim mt-1">
          +{formatBits(clickValue)}
        </span>
        {mainVisible && <FloatingTexts floats={floats} />}
      </button>
      <p className="text-xs text-white/40 max-w-[10rem] text-center">
        Cliquez pour extraire des données manuellement
      </p>

      {!mainVisible && (
        <button
          onClick={handleClick}
          aria-label="Récolter"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 h-20 w-20 rounded-full border-2 border-matrix-green bg-matrix-panel/95 text-matrix-green pulse-glow transition-transform active:scale-95 hover:bg-matrix-green/10 select-none backdrop-blur-sm"
        >
          <span className="text-[10px] tracking-widest">RÉCOLTER</span>
          <span className="block text-[10px] text-matrix-green-dim mt-0.5">
            +{formatBits(clickValue)}
          </span>
          <FloatingTexts floats={floats} />
        </button>
      )}
    </div>
  )
}
