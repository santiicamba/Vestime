'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const primaryButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-muted to-muted/80 text-foreground hover:from-secondary hover:to-secondary/80 hover:shadow-lg active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md active:scale-95',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function PrimaryButton({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof primaryButtonVariants>) {
  return (
    <button
      data-slot="primary-button"
      className={cn(primaryButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { PrimaryButton, primaryButtonVariants }
