import { useState, type DragEvent } from 'react'
import { FileUp, Moon, Palette, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { usePalette } from '@/context/PaletteContext'
import { PRESETS } from '@/presets'
import { Button } from '@/components/ui/button'
import { importPngColors } from '@/utils/canvas'
import { cn } from '@/lib/utils'

export function Header() {
  const { presetId, applyPreset, importHexes, previewDark, setPreviewDark } = usePalette()
  const [drag, setDrag] = useState(false)
  async function handle(file: File | undefined) {
    if (!file) return
    try {
      if (file.size === 0) throw new Error('The file is empty.')
      const isPng = file.type === 'image/png' || /\.png$/i.test(file.name)
      const hexes = isPng ? await importPngColors(file) : (await file.text()).match(/#?\b[0-9a-f]{6}\b/gi) ?? []
      const n = importHexes(hexes)
      if (!n) throw new Error('No valid hex colors found. Use one 6-digit hex per line.')
      toast.success(`Imported ${n} color${n > 1 ? 's' : ''}`)
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Import failed') }
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); void handle(e.dataTransfer.files?.[0]) }
  return (
    <header className="flex flex-wrap items-center gap-3 border-b-2 border-border bg-card px-4 py-3">
      <div className="flex items-center gap-2 pr-2">
        <span className="rounded bg-primary p-1.5 text-primary-foreground"><Palette className="h-5 w-5" /></span>
        <h1 className="font-mono text-3xl leading-none text-accent">Retro Palette &amp; Design Token Studio</h1>
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <select aria-label="Preset" value={presetId} onChange={(e) => applyPreset(e.target.value)} className="h-10 rounded-md border border-border bg-background px-2 text-sm">
          {presetId === 'custom' && <option value="custom">Custom</option>}
          {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <label onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
          className={cn('flex h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 text-sm hover:bg-muted', drag && 'border-accent bg-muted')}>
          <FileUp className="h-4 w-4" />Import .HEX / .PNG
          <input type="file" accept=".hex,.txt,.png,image/png" className="hidden" onChange={(e) => { void handle(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        <Button variant="outline" onClick={() => setPreviewDark(!previewDark)} aria-pressed={previewDark}>
          {previewDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}{previewDark ? 'Dark preview' : 'Light preview'}
        </Button>
      </div>
    </header>
  )
}
