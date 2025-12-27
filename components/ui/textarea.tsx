'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white',
          'border border-white/10 placeholder:text-white/40',
          'transition-all duration-200 resize-none',
          'focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
