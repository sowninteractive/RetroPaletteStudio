import { TOKEN_ORDER, type Preset, type TokenId } from '../types/palette'
// order: primary, secondary, accent, muted, background, foreground, border, card
const p = (id: string, name: string, c: string[]): Preset => ({
  id, name, colors: Object.fromEntries(TOKEN_ORDER.map((k, i) => [k, c[i]])) as Record<TokenId, string>,
})
export const PRESETS: Preset[] = [
  p('synthwave', 'Cyber-Synthwave', ['#ff2e97', '#7b2ff7', '#00f0ff', '#2a1b4d', '#120b26', '#f5e9ff', '#3d2a73', '#1c1238']),
  p('gameboy', 'Game Boy (4-color)', ['#306230', '#0f380f', '#8bac0f', '#8bac0f', '#9bbc0f', '#0f380f', '#306230', '#9bbc0f']),
  p('pico8', 'PICO-8', ['#ff004d', '#29adff', '#ffec27', '#5f574f', '#1d2b53', '#fff1e8', '#7e2553', '#000000']),
  p('nes', 'NES', ['#a81000', '#0058f8', '#fca044', '#7c7c7c', '#000000', '#fcfcfc', '#bcbcbc', '#3c3c3c']),
  p('arcade16', '16-bit Arcade', ['#ff5a36', '#2ec4b6', '#ffd23f', '#3a3f58', '#14203a', '#f1f5f9', '#2b3a67', '#1b2a4e']),
]
