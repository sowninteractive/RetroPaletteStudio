import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'
import { usePalette } from '@/context/PaletteContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buildStripPng, downloadDataUrl } from '@/utils/canvas'
import { genCssVars, genGdScript, genGdShader, genShadcnGlobals, genTailwindConfig, sortedGamePalette } from '@/utils/generators'
import { CodeBlock } from './CodeBlock'

export function ExportPanel() {
  const { tokens } = usePalette()
  const [open, setOpen] = useState(true)
  const pal = useMemo(() => sortedGamePalette(tokens), [tokens])
  const png = useMemo(() => buildStripPng(pal), [pal])
  return (
    <section className="border-t-2 border-border bg-card" aria-label="Export">
      <button className="flex w-full items-center justify-between px-4 py-2 text-left font-bold" onClick={() => setOpen(!open)} aria-expanded={open}>
        Export code &amp; assets {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <Tabs defaultValue="web">
            <TabsList><TabsTrigger value="web">Tailwind &amp; CSS</TabsTrigger><TabsTrigger value="godot">Godot 4 &amp; Game Dev</TabsTrigger></TabsList>
            <TabsContent value="web" className="grid gap-3 lg:grid-cols-3">
              <CodeBlock title="CSS variables (OKLCH)" code={genCssVars(tokens)} />
              <CodeBlock title="tailwind.config.js" code={genTailwindConfig(tokens)} />
              <CodeBlock title="shadcn globals.css (HSL)" code={genShadcnGlobals(tokens)} />
            </TabsContent>
            <TabsContent value="godot" className="grid gap-3 lg:grid-cols-3">
              <CodeBlock title="GDScript palette" code={genGdScript(tokens)} />
              <CodeBlock title=".gdshader" code={genGdShader(tokens)} />
              <div className="space-y-3 rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-medium">1D palette strip ({pal.length}×1 PNG)</p>
                {png && <img src={png} alt="Palette strip" className="pixelated h-8 w-full rounded border border-border" />}
                <Button onClick={() => downloadDataUrl(png, `palette_${pal.length}x1.png`)} disabled={!png}><Download className="h-4 w-4" />Download PNG</Button>
                <p className="text-xs text-muted-foreground">Sorted dark → light. Import in Godot with Filter off.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </section>
  )
}
