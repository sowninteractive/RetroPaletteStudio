import * as S from '@radix-ui/react-slider'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
export const Slider = ({ className, ...p }: ComponentPropsWithoutRef<typeof S.Root>) => (
  <S.Root className={cn('relative flex h-5 w-full touch-none select-none items-center', className)} {...p}>
    <S.Track className="relative h-1.5 w-full grow rounded-full bg-muted"><S.Range className="absolute h-full rounded-full bg-primary" /></S.Track>
    <S.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background" />
  </S.Root>
)
