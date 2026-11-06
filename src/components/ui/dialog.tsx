import * as D from '@radix-ui/react-dialog'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
export const Dialog = D.Root
export const DialogTrigger = D.Trigger
export const DialogClose = D.Close
export const DialogTitle = ({ className, ...p }: ComponentPropsWithoutRef<typeof D.Title>) => <D.Title className={cn('text-lg font-bold', className)} {...p} />
export const DialogDescription = ({ className, ...p }: ComponentPropsWithoutRef<typeof D.Description>) => <D.Description className={cn('text-sm text-muted-foreground', className)} {...p} />
/** `container` lets the dialog portal inside a themed wrapper so scoped CSS variables apply. */
export const DialogContent = ({ className, container, ...p }: ComponentPropsWithoutRef<typeof D.Content> & { container?: HTMLElement | null }) => (
  <D.Portal container={container ?? undefined}>
    <D.Overlay className="absolute inset-0 z-40 bg-black/60" />
    <D.Content className={cn('absolute left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-3 rounded-lg border border-border bg-card p-6 text-card-foreground', className)} {...p} />
  </D.Portal>
)
