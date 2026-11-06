import { hexToOklch, hexToRgb, rgbToHex } from './color'

export interface Sprite { w: number; h: number; lum: number[]; alpha: number[] }
const ROWS = [
  '................', '.....111111.....', '...1155555511...', '..155677776551..', '..156777777651..', '.15677777777651.',
  '.15700777700751.', '.15700777700751.', '.15677777777651.', '.15677300003651.', '..156777777651..', '..115566665511..',
  '...1114444111...', '....11....11....', '...111....111...', '................',
]
export const DEFAULT_SPRITE: Sprite = {
  w: 16, h: 16,
  lum: ROWS.flatMap((r) => r.split('').map((c) => (c === '.' ? 0 : Number(c) / 7))),
  alpha: ROWS.flatMap((r) => r.split('').map((c) => (c === '.' ? 0 : 255))),
}

export const uniqueSortedByLightness = (hexes: string[]): string[] =>
  [...new Set(hexes)].sort((a, b) => hexToOklch(a).l - hexToOklch(b).l)

/** Palette-swap: sprite luminance -> index into the lightness-sorted palette. Pass null for greyscale. */
export function drawSprite(canvas: HTMLCanvasElement | null, sprite: Sprite, colors: string[] | null): void {
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || sprite.w < 1 || sprite.h < 1) return
  canvas.width = sprite.w; canvas.height = sprite.h
  const img = ctx.createImageData(sprite.w, sprite.h)
  const pal = colors && colors.length ? uniqueSortedByLightness(colors).map(hexToRgb) : null
  for (let i = 0; i < sprite.lum.length; i++) {
    const lum = Math.min(1, Math.max(0, sprite.lum[i]))
    const c = pal ? pal[Math.min(pal.length - 1, Math.round(lum * (pal.length - 1)))] : { r: lum * 255, g: lum * 255, b: lum * 255 }
    img.data.set([c.r, c.g, c.b, sprite.alpha[i]], i * 4)
  }
  ctx.putImageData(img, 0, 0)
}

async function readPixels(file: File, maxSize: number): Promise<ImageData> {
  if (!file || file.size === 0) throw new Error('The file is empty.')
  let bmp: ImageBitmap
  try { bmp = await createImageBitmap(file) } catch { throw new Error('This file is not a readable image.') }
  const scale = Math.min(1, maxSize / Math.max(bmp.width, bmp.height))
  const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale))
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas is not available in this browser.')
  ctx.imageSmoothingEnabled = false; ctx.drawImage(bmp, 0, 0, w, h); bmp.close()
  return ctx.getImageData(0, 0, w, h)
}

export async function fileToSprite(file: File): Promise<Sprite> {
  const d = await readPixels(file, 64)
  const lum: number[] = [], alpha: number[] = []
  for (let i = 0; i < d.data.length; i += 4) {
    lum.push((0.2126 * d.data[i] + 0.7152 * d.data[i + 1] + 0.0722 * d.data[i + 2]) / 255); alpha.push(d.data[i + 3])
  }
  return { w: d.width, h: d.height, lum, alpha }
}

/** Most frequent opaque colors of a PNG (for importing palettes from images). */
export async function importPngColors(file: File, max = 8): Promise<string[]> {
  const d = await readPixels(file, 128)
  const counts = new Map<string, number>()
  for (let i = 0; i < d.data.length; i += 4) {
    if (d.data[i + 3] < 128) continue
    const hex = rgbToHex({ r: d.data[i], g: d.data[i + 1], b: d.data[i + 2] })
    counts.set(hex, (counts.get(hex) ?? 0) + 1)
  }
  const out = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([h]) => h)
  if (!out.length) throw new Error('No opaque pixels found in this image.')
  return out
}

/** Nx1 pixel palette strip (one pixel per color) as a PNG data URL. */
export function buildStripPng(colors: string[]): string {
  if (!colors.length) return ''
  const c = document.createElement('canvas'); c.width = colors.length; c.height = 1
  const ctx = c.getContext('2d'); if (!ctx) return ''
  colors.forEach((hex, i) => { ctx.fillStyle = hex; ctx.fillRect(i, 0, 1, 1) })
  return c.toDataURL('image/png')
}
export function downloadDataUrl(url: string, filename: string): void {
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
}
