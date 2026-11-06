import { useEffect, useRef, useState } from 'react'
import { Upload, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { usePalette } from '@/context/PaletteContext'
import { Button } from '@/components/ui/button'
import { DEFAULT_SPRITE, drawSprite, fileToSprite, uniqueSortedByLightness, type Sprite } from '@/utils/canvas'

export function SpritePreview() {
  const { tokens } = usePalette()
  const [sprite, setSprite] = useState<Sprite>(DEFAULT_SPRITE)
  const swapped = useRef<HTMLCanvasElement>(null), grey = useRef<HTMLCanvasElement>(null)
  const hexes = tokens.map((t) => t.hex)
  const key = hexes.join()
  useEffect(() => { drawSprite(swapped.current, sprite, hexes); drawSprite(grey.current, sprite, null) }, [sprite, key]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onFile(f: File | undefined) {
    if (!f) return
    try { setSprite(await fileToSprite(f)); toast.success('Sprite loaded') }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Could not load image') }
  }
  const scale = Math.max(2, Math.floor(256 / Math.max(sprite.w, sprite.h)))
  const dims = { width: sprite.w * scale, height: sprite.h * scale }
  const ramp = uniqueSortedByLightness(hexes)
  return (
    <div className="space-y-4 rounded-xl border-2 border-border bg-card p-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => document.getElementById('sprite-file')?.click()}><Upload className="h-4 w-4" />Upload PNG</Button>
        <input id="sprite-file" type="file" accept="image/png,image/*" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
        <Button variant="ghost" onClick={() => setSprite(DEFAULT_SPRITE)}><RotateCcw className="h-4 w-4" />Reset sprite</Button>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        {[{ r: grey, label: 'Greyscale source' }, { r: swapped, label: 'Palette-swapped' }].map(({ r, label }) => (
          <figure key={label} className="space-y-2">
            <canvas ref={r} className="pixelated rounded border border-border bg-muted" style={dims} aria-label={label} />
            <figcaption className="text-sm text-muted-foreground">{label}</figcaption>
          </figure>
        ))}
      </div>
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Luminance ramp (dark → light): sprite brightness picks a color from this strip.</p>
        <div className="flex h-8 overflow-hidden rounded border border-border">{ramp.map((h) => <div key={h} className="flex-1" style={{ background: h }} title={h} />)}</div>
      </div>
    </div>
  )
}
