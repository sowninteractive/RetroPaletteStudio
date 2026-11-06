import { useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { usePalette } from '@/context/PaletteContext'
import { Badge } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const gradeClass = (g: string) =>
  g === 'AAA' ? 'border-emerald-400 text-emerald-300' : g === 'AA' ? 'border-lime-400 text-lime-300' : g === 'AA Large' ? 'border-amber-400 text-amber-300' : 'border-red-400 text-red-300'

export function SwatchList() {
  const { tokens, selectedId, select, reorder } = usePalette()
  const from = useRef<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  return (
    <ul className="space-y-1.5" aria-label="Color tokens (drag to reorder)">
      {tokens.map((t, i) => (
        <li key={t.id} draggable
          onDragStart={() => { from.current = i }}
          onDragOver={(e) => { e.preventDefault(); setOver(i) }}
          onDragLeave={() => setOver(null)}
          onDragEnd={() => { from.current = null; setOver(null) }}
          onDrop={() => { if (from.current !== null) reorder(from.current, i); from.current = null; setOver(null) }}
          className={cn('flex items-center gap-2 rounded-md border border-border bg-card p-1.5', selectedId === t.id && 'border-accent', over === i && 'border-primary')}>
          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
          <button className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => select(t.id)} aria-pressed={selectedId === t.id}>
            <span className="h-8 w-8 shrink-0 rounded border border-border" style={{ background: t.hex }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{t.name}</span>
              <span className="block font-mono text-lg leading-none text-muted-foreground">{t.hex}</span>
            </span>
          </button>
          <Badge className={gradeClass(t.wcagRating.grade)} title="Contrast of the token's relevant pairing (accents vs background; card/muted/background vs foreground)">
            {t.wcagRating.ratio.toFixed(1)} {t.wcagRating.grade}
          </Badge>
        </li>
      ))}
    </ul>
  )
}
