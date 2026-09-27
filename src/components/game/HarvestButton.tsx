import { useCallback, useRef, useState } from 'react'
import { formatNumber } from '../../lib/format'

interface FloatingText {
  id: number
  value: number
  x: number
}

export default function HarvestButton({
  clickValue,
  onHarvest,
}: {
  clickValue: number
  onHarvest: () => void
}) {
  const [floats, setFloats] = useState<Array<FloatingText>>([])
  const nextId = useRef(0)

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
        onClick={handleClick}
        className="relative h-36 w-36 rounded-full border-2 border-matrix-green bg-matrix-panel text-matrix-green pulse-glow transition-transform active:scale-95 hover:bg-matrix-green/10 select-none"
      >
        <span className="text-sm tracking-widest">RÉCOLTER</span>
        <span className="block text-xs text-matrix-green-dim mt-1">
          +{formatNumber(clickValue)}
        </span>
        {floats.map((f) => (
          <span
            key={f.id}
            className="floating-text absolute top-2 text-matrix-green font-semibold text-sm pointer-events-none"
            style={{ left: `${f.x}%` }}
          >
            +{formatNumber(f.value)}
          </span>
        ))}
      </button>
      <p className="text-xs text-white/40 max-w-[10rem] text-center">
        Cliquez pour extraire des données manuellement
      </p>
    </div>
  )
}
