import { useMemo, useState, type CSSProperties } from 'react'
import { usePalette } from '@/context/PaletteContext'
import { applyMode, buildThemeVars, tokensToMap } from '@/utils/theme'
import { Button } from '@/components/ui/button'
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ContrastBadge } from './ContrastBadge'

export function WebPreview() {
  const { tokens, previewDark } = usePalette()
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const v = useMemo(() => buildThemeVars(applyMode(tokensToMap(tokens), previewDark)), [tokens, previewDark])
  const style = Object.fromEntries(Object.entries(v).map(([k, x]) => ['--' + k, x])) as CSSProperties
  return (
    <div ref={setHost} style={style} className="relative min-h-[560px] space-y-6 overflow-hidden rounded-xl border-2 border-border bg-background p-4 text-foreground sm:p-6">
      <Tabs defaultValue="overview">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="components">Components</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>
        <TabsContent value="overview" className="text-sm text-muted-foreground">Navigation tabs follow your muted, background and foreground tokens.</TabsContent>
        <TabsContent value="components" className="text-sm text-muted-foreground">Everything on this canvas is driven by CSS variables set from the master palette.</TabsContent>
        <TabsContent value="settings" className="text-sm text-muted-foreground">Switch light/dark in the header to flip the neutral tokens.</TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button><Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button><Button variant="destructive">Destructive</Button>
        <ContrastBadge fg={v['primary-foreground']} bg={v.primary} label="Primary button" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between"><CardTitle>Level 1-2 Summary</CardTitle><Badge className="bg-accent text-accent-foreground">New</Badge></div>
            <p className="text-sm text-muted-foreground">Cleared in 02:14 with 3 lives left.</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2 text-sm">
            <Badge>Speedrun</Badge><Badge className="bg-secondary text-secondary-foreground">Co-op</Badge>
            <ContrastBadge fg={v['card-foreground']} bg={v.card} label="Card text" />
            <ContrastBadge fg={v['muted-foreground']} bg={v.card} label="Muted on card" />
          </CardContent>
          <CardFooter><Button size="sm">Replay</Button><Button size="sm" variant="ghost">Share</Button></CardFooter>
        </Card>

        <Card>
          <CardHeader><CardTitle>Player profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="block text-sm font-medium" htmlFor="pv-name">Display name</label>
            <input id="pv-name" defaultValue="PIXEL_KNIGHT" className="h-10 w-full rounded-md border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-2" />
            <div className="flex items-center gap-2"><ContrastBadge fg={v.foreground} bg={v.background} label="Input text" /><span className="text-xs text-muted-foreground">Input text on background</span></div>
            <Dialog>
              <DialogTrigger asChild><Button variant="outline">Delete save file</Button></DialogTrigger>
              <DialogContent container={host}>
                <DialogTitle>Delete this save?</DialogTitle>
                <DialogDescription>Your progress on Level 1-2 will be removed.</DialogDescription>
                <div className="flex justify-end gap-2"><DialogClose asChild><Button variant="ghost">Keep save</Button></DialogClose><DialogClose asChild><Button variant="destructive">Delete</Button></DialogClose></div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
