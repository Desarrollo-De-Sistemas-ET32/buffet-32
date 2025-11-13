import * as React from "react"

interface InfiniteScrollProps {
  isLoading: boolean
  hasMore: boolean
  next: () => unknown
  threshold?: number
  root?: Element | Document | null
  rootMargin?: string
  children?: React.ReactNode
}

export default function InfiniteScroll({
  isLoading,
  hasMore,
  next,
  threshold = 0.1,
  root = null,
  rootMargin = "20px",
  children
}: InfiniteScrollProps) {
  const observer = React.useRef<IntersectionObserver>(undefined)

  const observerRef = React.useCallback(
    (element: HTMLElement | null) => {
      let safeThreshold = threshold
      if (threshold < 0 || threshold > 1) {
        console.warn(
          "threshold should be between 0 and 1. You are exceed the range. will use default value: 0.1"
        )
        safeThreshold = 0.1
      }

      if (isLoading) return

      if (observer.current) observer.current.disconnect()
      if (!element) return

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            next()
          }
        },
        { threshold: safeThreshold, root, rootMargin }
      )
      observer.current.observe(element)
    },
    [isLoading, hasMore, next, threshold, root, rootMargin]
  )

  return (
    <div className="w-full flex flex-col">
      {children}
      <div 
        ref={observerRef} 
        className="w-full h-4" 
        style={{ visibility: hasMore ? 'visible' : 'hidden' }}
      />
    </div>
  )
}
