import type { ColorToken, TokenMap } from '../types/palette'
import { bestText, hexToOklch, mix, oklchToHex, readable } from './color'

export const tokensToMap = (t: ColorToken[]): TokenMap => Object.fromEntries(t.map((x) => [x.id, x.hex])) as TokenMap

/** Flips neutrals when the palette's polarity doesn't match the requested preview mode. */
export function applyMode(m: TokenMap, dark: boolean): TokenMap {
  const bgL = hexToOklch(m.background).l, fgL = hexToOklch(m.foreground).l
  const matches = dark ? bgL <= fgL : bgL >= fgL
  if (matches) return m
  const out = { ...m }
  for (const k of ['background', 'foreground', 'card', 'muted', 'border'] as const) {
    const o = hexToOklch(m[k]); out[k] = oklchToHex({ ...o, l: 1 - o.l })
  }
  return out
}

/** Full shadcn-style variable set (hex values) derived from the 8 master tokens. */
export function buildThemeVars(m: TokenMap): Record<string, string> {
  const destructive = '#ef4444'
  return {
    background: m.background, foreground: m.foreground,
    card: m.card, 'card-foreground': readable(m.foreground, m.card),
    primary: m.primary, 'primary-foreground': bestText(m.primary),
    secondary: m.secondary, 'secondary-foreground': bestText(m.secondary),
    accent: m.accent, 'accent-foreground': bestText(m.accent),
    muted: m.muted, 'muted-foreground': readable(mix(m.foreground, m.muted, 0.3), m.muted),
    destructive, 'destructive-foreground': bestText(destructive),
    border: m.border, input: m.border, ring: m.accent,
  }
}
