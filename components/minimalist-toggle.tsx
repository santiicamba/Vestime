'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MinimalistToggleProps {
  value: boolean
  onValueChange: (value: boolean) => void
  trueLabel?: string
  falseLabel?: string
  disabled?: boolean
}

export function MinimalistToggle({
  value,
  onValueChange,
  trueLabel = 'Sí',
  falseLabel = 'No',
  disabled = false,
}: MinimalistToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-secondary/30 border border-border p-1 gap-1">
      <button
        onClick={() => !disabled && onValueChange(true)}
        disabled={disabled}
        className={cn(
          'px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
          value
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {trueLabel}
      </button>
      <button
        onClick={() => !disabled && onValueChange(false)}
        disabled={disabled}
        className={cn(
          'px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
          !value
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {falseLabel}
      </button>
    </div>
  )
}
