import { useEffect, useRef, useState } from 'react'
import Card from './Card'

interface CardDealAnimationProps {
  cardCount: number // Number of cards to animate (one per player)
  startPosition: { x: number; y: number }
  endPositions: Array<{ x: number; y: number }>
  onAnimationComplete: () => void
  isAnimating: boolean
}

const ANIMATION_DURATION = 1000 // milliseconds - slightly longer for deal animation

export default function CardDealAnimation({
  cardCount,
  startPosition,
  endPositions,
  onAnimationComplete,
  isAnimating,
}: CardDealAnimationProps) {
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onAnimationComplete)

  // Update ref when callback changes to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete
  }, [onAnimationComplete])

  useEffect(() => {
    if (!isAnimating) {
      setProgress(0)
      return
    }

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const currentProgress = Math.min(elapsed / ANIMATION_DURATION, 1)

      // Ease-in-out cubic function for smooth animation
      const easeInOutCubic = currentProgress < 0.5
        ? 4 * currentProgress * currentProgress * currentProgress
        : 1 - Math.pow(-2 * currentProgress + 2, 3) / 2

      setProgress(easeInOutCubic)

      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setTimeout(() => {
          onCompleteRef.current()
        }, 50)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isAnimating])

  if (!isAnimating || cardCount === 0 || endPositions.length === 0) {
    return null
  }

  // Use the actual number of positions available (one card per player)
  const actualCardCount = Math.min(cardCount, endPositions.length)
  
  // Validate arrays match - cardCount should equal endPositions.length (one card per player)
  if (cardCount !== endPositions.length) {
    // Length mismatch, but continue with actualCardCount
  }
  
  if (actualCardCount === 0) {
    return null
  }

  // Validate start position
  if (!startPosition || (startPosition.x === 0 && startPosition.y === 0)) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {endPositions.slice(0, actualCardCount).map((endPos, index) => {
        // Validate end position
        if (!endPos || (endPos.x === 0 && endPos.y === 0)) {
          return null
        }

        // Stagger animation slightly for each card (0.1s delay per card)
        const cardDelay = index * 0.1
        const adjustedProgress = Math.max(0, Math.min(1, (progress * ANIMATION_DURATION - cardDelay * 1000) / ANIMATION_DURATION))

        if (adjustedProgress <= 0) {
          return null // Card hasn't started animating yet
        }

        const adjustedX = startPosition.x + (endPos.x - startPosition.x) * adjustedProgress
        const adjustedY = startPosition.y + (endPos.y - startPosition.y) * adjustedProgress
        const adjustedRotation = (adjustedProgress - 0.5) * 15
        const adjustedScale = 1 + Math.sin(adjustedProgress * Math.PI) * 0.15

        return (
          <div
            key={`deal-${index}`}
            className="absolute"
            style={{
              left: `${adjustedX}px`,
              top: `${adjustedY}px`,
              transform: `translate(-50%, -50%) rotate(${adjustedRotation}deg) scale(${adjustedScale})`,
              zIndex: 10000 + index,
              transition: 'none', // Disable CSS transitions, we're using JS animation
              willChange: 'transform', // Optimize for animation
            }}
          >
            <Card suit={0} rank={0} isFaceDown={true} />
          </div>
        )
      }).filter(Boolean)}
    </div>
  )
}

