import type { ColorToken } from '../types/palette'
import { buildThemeVars, tokensToMap } from './theme'
import { fmtHslTriplet, fmtOklch, hexToHsl, hexToOklch } from './color'
import { uniqueSortedByLightness } from './canvas'

const vars = (t: ColorToken[]) => Object.entries(buildThemeVars(tokensToMap(t)))

export const genCssVars = (t: ColorToken[]) =>
  `:root {\n${vars(t).map(([k, v]) => `  --${k}: ${fmtOklch(hexToOklch(v))}; /* ${v} */`).join('\n')}\n  --radius: 0.5rem;\n}\n`

export const genTailwindConfig = (t: ColorToken[]) => {
  const keys = vars(t).map(([k]) => k)
  const pair = (n: string) => `      ${n}: { DEFAULT: "var(--${n})", foreground: "var(--${n}-foreground)" },`
  const flat = ['background', 'foreground', 'border', 'input', 'ring'].filter((k) => keys.includes(k))
    .map((k) => `      ${k}: "var(--${k})",`)
  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${flat.join('\n')}\n${['card', 'primary', 'secondary', 'accent', 'muted', 'destructive'].map(pair).join('\n')}\n      },\n    },\n  },\n}\n`
}

export const genShadcnGlobals = (t: ColorToken[]) =>
  `@layer base {\n  :root {\n${vars(t).map(([k, v]) => `    --${k}: ${fmtHslTriplet(hexToHsl(v))};`).join('\n')}\n    --radius: 0.5rem;\n  }\n}\n/* Use as: background-color: hsl(var(--background)) / colors: { background: "hsl(var(--background))" } */\n`

export const sortedGamePalette = (t: ColorToken[]) => uniqueSortedByLightness(t.map((x) => x.hex))

export const genGdScript = (t: ColorToken[]) => {
  const p = sortedGamePalette(t)
  return `# Sorted dark -> light (matches the sprite preview mapping)\nconst PALETTE: Array[Color] = [\n${p.map((h) => `\tColor("${h}"),`).join('\n')}\n]\n`
}

export const genGdShader = (t: ColorToken[]) => {
  const n = sortedGamePalette(t).length
  return `shader_type canvas_item;\n\n// Fill with PALETTE (dark -> light) from GDScript via set_shader_parameter().\nuniform vec3 palette[${n}] : source_color;\n\nvoid fragment() {\n\tvec4 src = texture(TEXTURE, UV);\n\tfloat lum = dot(src.rgb, vec3(0.2126, 0.7152, 0.0722));\n\tint idx = clamp(int(round(lum * float(${n - 1}))), 0, ${n - 1});\n\tCOLOR = vec4(palette[idx], src.a);\n}\n`
}
