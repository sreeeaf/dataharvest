import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CollapsibleSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <section className="rounded-xl border border-matrix-border bg-matrix-dark/60 flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center justify-between gap-2 px-4 py-3 text-left group"
      >
        <h2 className="text-sm uppercase tracking-[0.25em] text-white/50 group-hover:text-matrix-green transition-colors">
          {title}
        </h2>
        <ChevronDown
          size={16}
          className={`text-white/40 group-hover:text-matrix-green transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </section>
  )
}
