const v = (n) => `var(--${n})`
const pair = (n) => ({ DEFAULT: v(n), foreground: v(`${n}-foreground`) })
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: v('background'), foreground: v('foreground'), border: v('border'), input: v('input'), ring: v('ring'),
        card: pair('card'), primary: pair('primary'), secondary: pair('secondary'), accent: pair('accent'),
        muted: pair('muted'), destructive: pair('destructive'),
      },
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'], mono: ['"VT323"', '"JetBrains Mono"', 'ui-monospace', 'monospace'] },
    },
  },
}
