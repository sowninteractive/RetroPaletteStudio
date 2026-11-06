import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
type P = HTMLAttributes<HTMLDivElement>
export const Card = ({ className, ...p }: P) => <div className={cn('rounded-lg border border-border bg-card text-card-foreground', className)} {...p} />
export const CardHeader = ({ className, ...p }: P) => <div className={cn('flex flex-col gap-1 p-4', className)} {...p} />
export const CardTitle = ({ className, ...p }: P) => <h3 className={cn('font-bold leading-none', className)} {...p} />
export const CardContent = ({ className, ...p }: P) => <div className={cn('p-4 pt-0', className)} {...p} />
export const CardFooter = ({ className, ...p }: P) => <div className={cn('flex items-center gap-2 p-4 pt-0', className)} {...p} />
export const Badge = ({ className, ...p }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium', className)} {...p} />
)
