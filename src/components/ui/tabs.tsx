import * as T from '@radix-ui/react-tabs'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
export const Tabs = T.Root
export const TabsList = ({ className, ...p }: ComponentPropsWithoutRef<typeof T.List>) => (
  <T.List className={cn('inline-flex rounded-md bg-muted p-1 text-muted-foreground', className)} {...p} />
)
export const TabsTrigger = ({ className, ...p }: ComponentPropsWithoutRef<typeof T.Trigger>) => (
  <T.Trigger className={cn('rounded px-3 py-1.5 text-sm font-medium transition data-[state=active]:bg-background data-[state=active]:text-foreground', className)} {...p} />
)
export const TabsContent = ({ className, ...p }: ComponentPropsWithoutRef<typeof T.Content>) => <T.Content className={cn('mt-3', className)} {...p} />
