import { contrast, grade } from '@/utils/color'
export function ContrastBadge({ fg, bg, label }: { fg: string; bg: string; label?: string }) {
  const r = contrast(fg, bg), g = grade(r)
  const tone = g === 'AAA' ? '#047857' : g === 'AA' ? '#4d7c0f' : g === 'AA Large' ? '#b45309' : '#b91c1c'
  return (
    <span title={`${label ?? 'Text'} contrast ${r.toFixed(2)}:1`} className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-bold text-white" style={{ background: tone }}>
      {g} {r.toFixed(1)}
    </span>
  )
}
