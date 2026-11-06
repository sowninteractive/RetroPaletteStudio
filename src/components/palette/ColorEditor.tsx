import { useEffect, useState } from 'react'
import { usePalette } from '@/context/PaletteContext'
import { Slider } from '@/components/ui/slider'
import { fmtHsl, fmtOklch, normalizeHex } from '@/utils/color'
import { cn } from '@/lib/utils'

export function ColorEditor() {
  const { selected: t, setHex, setOklch } = usePalette()
  const [draft, setDraft] = useState(t.hex)
  const invalid = normalizeHex(draft) === null
  useEffect(() => setDraft(t.hex), [t.hex, t.id])
  const { l, c, h } = t.oklch
  const rows: { label: string; value: number; min: number; max: number; step: number; fmt: string; on: (v: number) => void }[] = [
    { label: 'Lightness', value: l, min: 0, max: 1, step: 0.005, fmt: (l * 100).toFixed(1) + '%', on: (v) => setOklch(t.id, v, c, h) },
    { label: 'Chroma', value: c, min: 0, max: 0.4, step: 0.002, fmt: c.toFixed(3), on: (v) => setOklch(t.id, l, v, h) },
    { label: 'Hue', value: h, min: 0, max: 360, step: 1, fmt: h.toFixed(0) + '°', on: (v) => setOklch(t.id, l, c, v) },
  ]
  return (
    <section className="space-y-3 rounded-lg border border-border bg-card p-3" aria-label={`Edit ${t.name}`}>
      <div className="flex items-center gap-2">
        <input type="color" aria-label={`${t.name} color picker`} value={t.hex} onChange={(e) => setHex(t.id, e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent" />
        <input value={draft} spellCheck={false} aria-label={`${t.name} hex value`} aria-invalid={invalid}
          onChange={(e) => { setDraft(e.target.value); setHex(t.id, e.target.value) }}
          onBlur={() => setDraft(t.hex)}
          className={cn('h-10 min-w-0 flex-1 rounded-md border bg-background px-3 font-mono text-xl', invalid ? 'border-destructive' : 'border-border')} />
      </div>
      {invalid && <p className="text-xs text-destructive">Enter a hex color like #ff2e97 or #f29.</p>}
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{r.label}</span><span className="font-mono">{r.fmt}</span></div>
          <Slider aria-label={r.label} min={r.min} max={r.max} step={r.step} value={[r.value]} onValueChange={(v) => r.on(v[0])} />
        </div>
      ))}
      <p className="break-all font-mono text-sm text-muted-foreground">{fmtOklch(t.oklch)}<br />{fmtHsl(t.hsl)}</p>
      <p className="text-xs text-muted-foreground">Contrast: {t.wcagRating.vsBackground.toFixed(2)}:1 vs background · {t.wcagRating.vsForeground.toFixed(2)}:1 vs foreground</p>
    </section>
  )
}
