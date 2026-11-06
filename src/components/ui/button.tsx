import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
const variants = {
  default: 'bg-primary text-primary-foreground hover:brightness-110',
  secondary: 'bg-secondary text-secondary-foreground hover:brightness-110',
  outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:brightness-110',
  ghost: 'text-foreground hover:bg-muted',
}
const sizes = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', icon: 'h-8 w-8' }
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: keyof typeof variants; size?: keyof typeof sizes }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'md', ...p }, ref) => (
  <button ref={ref} className={cn('inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:opacity-50', variants[variant], sizes[size], className)} {...p} />
))
Button.displayName = 'Button'
