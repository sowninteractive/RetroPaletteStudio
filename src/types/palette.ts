export type TokenId = 'primary' | 'secondary' | 'accent' | 'muted' | 'background' | 'foreground' | 'border' | 'card'
export const TOKEN_ORDER: TokenId[] = ['primary', 'secondary', 'accent', 'muted', 'background', 'foreground', 'border', 'card']
export interface Oklch { l: number; c: number; h: number }
export interface Hsl { h: number; s: number; l: number }
export type WcagGrade = 'AAA' | 'AA' | 'AA Large' | 'Fail'
export interface WcagRating { vsBackground: number; vsForeground: number; ratio: number; grade: WcagGrade }
export interface ColorToken { id: TokenId; name: string; hex: string; oklch: Oklch; hsl: Hsl; wcagRating: WcagRating }
export interface Preset { id: string; name: string; colors: Record<TokenId, string> }
export type TokenMap = Record<TokenId, string>
