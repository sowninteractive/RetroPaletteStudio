import type { Hsl, Oklch, WcagGrade } from '../types/palette'
export interface RGB { r: number; g: number; b: number }
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

/** Returns a normalized #rrggbb string or null for malformed input. */
export function normalizeHex(input: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((input ?? '').trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
  return '#' + h.toLowerCase()
}
export function hexToRgb(hex: string): RGB {
  const h = normalizeHex(hex) ?? '#000000'
  return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) }
}
export const rgbToHex = ({ r, g, b }: RGB) =>
  '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')

export function hexToHsl(hex: string): Hsl {
  const { r, g, b } = hexToRgb(hex)
  const [R, G, B] = [r / 255, g / 255, b / 255]
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min, l = (max + min) / 2
  let h = 0
  if (d) {
    if (max === R) h = ((G - B) / d) % 6
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h, s: s * 100, l: l * 100 }
}

export function hexToOklch(hex: string): Oklch {
  const { r, g, b } = hexToRgb(hex)
  const R = toLin(r / 255), G = toLin(g / 255), B = toLin(b / 255)
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const c = Math.hypot(A, Bb)
  let h = (Math.atan2(Bb, A) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h: c < 1e-4 ? 0 : h }
}
function oklchToLinear(L: number, c: number, h: number): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
}
/** OKLCH -> hex with chroma reduction to stay inside sRGB. */
export function oklchToHex(o: Oklch): string {
  const L = clamp(o.l, 0, 1), h = ((o.h % 360) + 360) % 360
  const ok = (v: number[]) => v.every((x) => x >= -0.0001 && x <= 1.0001)
  let rgb = oklchToLinear(L, o.c, h)
  if (!ok(rgb)) {
    let lo = 0, hi = o.c
    for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if (ok(oklchToLinear(L, mid, h))) lo = mid; else hi = mid }
    rgb = oklchToLinear(L, lo, h)
  }
  const [r, g, b] = rgb.map((x) => toGam(clamp(x, 0, 1)) * 255)
  return rgbToHex({ r, g, b })
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * toLin(r / 255) + 0.7152 * toLin(g / 255) + 0.0722 * toLin(b / 255)
}
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
export function grade(ratio: number): WcagGrade {
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
}
export const bestText = (bg: string) => (contrast(bg, '#000000') >= contrast(bg, '#ffffff') ? '#000000' : '#ffffff')
export const readable = (fg: string, bg: string) => (contrast(fg, bg) >= 4.5 ? fg : bestText(bg))
export function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a), y = hexToRgb(b)
  return rgbToHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t })
}
export const fmtOklch = (o: Oklch) => `oklch(${(o.l * 100).toFixed(1)}% ${o.c.toFixed(3)} ${o.h.toFixed(1)})`
export const fmtHsl = (h: Hsl) => `hsl(${h.h.toFixed(0)} ${h.s.toFixed(0)}% ${h.l.toFixed(0)}%)`
export const fmtHslTriplet = (h: Hsl) => `${h.h.toFixed(0)} ${h.s.toFixed(0)}% ${h.l.toFixed(0)}%`
