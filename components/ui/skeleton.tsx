'use client'

import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/5',
        className
      )}
      {...props}
    />
  )
}

function SkeletonText({
  className,
  lines = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-4/5' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/5 p-6 space-y-4',
        className
      )}
      {...props}
    >
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <SkeletonText lines={2} />
    </div>
  )
}

function SkeletonImage({
  className,
  aspectRatio = '16/9',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { aspectRatio?: string }) {
  return (
    <Skeleton
      className={cn('w-full', className)}
      style={{ aspectRatio }}
      {...props}
    />
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonImage }
