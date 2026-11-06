import { Toaster } from 'sonner'
import { Header } from './components/Header'
import { SwatchList } from './components/palette/SwatchList'
import { ColorEditor } from './components/palette/ColorEditor'
import { WebPreview } from './components/preview/WebPreview'
import { SpritePreview } from './components/preview/SpritePreview'
import { ExportPanel } from './components/export/ExportPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grid flex-1 gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-3"><SwatchList /><ColorEditor /></aside>
        <Tabs defaultValue="web" className="min-w-0">
          <TabsList><TabsTrigger value="web">Web UI Components</TabsTrigger><TabsTrigger value="sprite">Retro Pixel Sprite</TabsTrigger></TabsList>
          <TabsContent value="web"><WebPreview /></TabsContent>
          <TabsContent value="sprite"><SpritePreview /></TabsContent>
        </Tabs>
      </main>
      <ExportPanel />
      <Toaster theme="dark" richColors position="bottom-right" />
    </div>
  )
}
