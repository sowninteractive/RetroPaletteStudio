import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function CodeBlock({ title, code }: { title: string; code: string }) {
  async function copy() {
    try { await navigator.clipboard.writeText(code); toast.success(`${title} copied`) }
    catch { toast.error('Clipboard unavailable. Select the text and copy manually.') }
  }
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-sm font-medium">{title}</span>
        <Button size="sm" variant="ghost" onClick={copy} aria-label={`Copy ${title}`}><Copy className="h-4 w-4" />Copy</Button>
      </div>
      <pre className="max-h-64 overflow-auto p-3 font-mono text-base leading-tight text-muted-foreground"><code>{code}</code></pre>
    </div>
  )
}
