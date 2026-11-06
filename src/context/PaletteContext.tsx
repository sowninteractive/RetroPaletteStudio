import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { TOKEN_ORDER, type ColorToken, type TokenId, type TokenMap, type WcagRating } from '../types/palette'
import { PRESETS } from '../presets'
import { contrast, grade, hexToHsl, hexToOklch, normalizeHex, oklchToHex } from '../utils/color'

interface Ctx {
  tokens: ColorToken[]; selected: ColorToken; selectedId: TokenId; presetId: string
  previewDark: boolean; setPreviewDark: (v: boolean) => void
  select: (id: TokenId) => void; setHex: (id: TokenId, hex: string) => boolean
  setOklch: (id: TokenId, l: number, c: number, h: number) => void
  reorder: (from: number, to: number) => void; applyPreset: (id: string) => void
  importHexes: (hexes: string[]) => number
}
const PaletteCtx = createContext<Ctx | null>(null)
const NAMES: Record<TokenId, string> = { primary: 'Primary', secondary: 'Secondary', accent: 'Accent', muted: 'Muted', background: 'Background', foreground: 'Foreground', border: 'Border', card: 'Card' }

function build(order: TokenId[], map: TokenMap): ColorToken[] {
  return order.map((id) => {
    const hex = map[id]
    const vsBackground = contrast(hex, map.background), vsForeground = contrast(hex, map.foreground)
    const ratio = id === 'card' || id === 'muted' || id === 'background' ? vsForeground : vsBackground
    const wcagRating: WcagRating = { vsBackground, vsForeground, ratio, grade: grade(ratio) }
    return { id, name: NAMES[id], hex, oklch: hexToOklch(hex), hsl: hexToHsl(hex), wcagRating }
  })
}
const toMap = (t: ColorToken[]) => Object.fromEntries(t.map((x) => [x.id, x.hex])) as TokenMap

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<ColorToken[]>(() => build(TOKEN_ORDER, PRESETS[0].colors))
  const [selectedId, setSelectedId] = useState<TokenId>('primary')
  const [presetId, setPresetId] = useState(PRESETS[0].id)
  const [previewDark, setPreviewDark] = useState(true)

  const update = useCallback((fn: (m: TokenMap) => TokenMap) =>
    setTokens((prev) => build(prev.map((t) => t.id), fn(toMap(prev)))), [])

  const setHex = useCallback((id: TokenId, raw: string) => {
    const hex = normalizeHex(raw)
    if (!hex) return false
    update((m) => ({ ...m, [id]: hex })); setPresetId('custom'); return true
  }, [update])
  const setOklch = useCallback((id: TokenId, l: number, c: number, h: number) => {
    update((m) => ({ ...m, [id]: oklchToHex({ l, c, h }) })); setPresetId('custom')
  }, [update])
  const reorder = useCallback((from: number, to: number) => setTokens((prev) => {
    if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev
    const next = [...prev]; const [m] = next.splice(from, 1); next.splice(to, 0, m); return next
  }), [])
  const applyPreset = useCallback((id: string) => {
    const pr = PRESETS.find((x) => x.id === id); if (!pr) return
    update(() => pr.colors); setPresetId(id)
  }, [update])
  const importHexes = useCallback((hexes: string[]) => {
    const valid = hexes.map(normalizeHex).filter((h): h is string => !!h)
    if (!valid.length) return 0
    update((m) => {
      const next = { ...m }
      tokens.forEach((t, i) => { if (valid[i]) next[t.id] = valid[i] })
      return next
    })
    setPresetId('custom'); return Math.min(valid.length, tokens.length)
  }, [update, tokens])

  const value = useMemo<Ctx>(() => ({
    tokens, selectedId, selected: tokens.find((t) => t.id === selectedId) ?? tokens[0], presetId,
    previewDark, setPreviewDark, select: setSelectedId, setHex, setOklch, reorder, applyPreset, importHexes,
  }), [tokens, selectedId, presetId, previewDark, setHex, setOklch, reorder, applyPreset, importHexes])
  return <PaletteCtx.Provider value={value}>{children}</PaletteCtx.Provider>
}
export function usePalette(): Ctx {
  const c = useContext(PaletteCtx); if (!c) throw new Error('usePalette must be used inside PaletteProvider'); return c
}
