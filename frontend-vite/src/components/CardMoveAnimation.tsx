import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface CardMoveAnimationProps {
  cards: GameCard[]
  startPositions: Array<{ x: number; y: number }>
  endPosition: { x: number; y: number }
  onAnimationComplete: () => void
  isAnimating: boolean
}

export default function CardMoveAnimation({
  cards,
  startPositions,
  endPosition,
  onAnimationComplete,
  isAnimating,
}: CardMoveAnimationProps) {
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

    const duration = 800 // milliseconds
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const currentProgress = Math.min(elapsed / duration, 1)

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

  // Validate props before rendering
  if (!isAnimating || cards.length === 0 || startPositions.length === 0) {
    return null
  }

  // Ensure arrays match
  if (cards.length !== startPositions.length) {
    console.warn('CardMoveAnimation: cards and startPositions length mismatch', {
      cardsLength: cards.length,
      positionsLength: startPositions.length
    })
    return null
  }

  // Validate end position
  if (!endPosition || endPosition.x === 0 && endPosition.y === 0) {
    console.warn('CardMoveAnimation: Invalid end position', endPosition)
    return null
  }

  const convertCard = (card: GameCard) => {
    if (card.type >= 4) {
      return { suit: 0, rank: 0, isSpecial: true, specialType: card.type }
    }
    return { suit: card.type, rank: card.number }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {cards.map((card, index) => {
        const displayCard = convertCard(card)
        const startPos = startPositions[index]
        
        // Validate start position
        if (!startPos || (startPos.x === 0 && startPos.y === 0 && index > 0)) {
          // Skip invalid positions (but allow first card at 0,0 as fallback)
          return null
        }
        
        // Calculate current position with easing
        const currentX = startPos.x + (endPosition.x - startPos.x) * progress
        const currentY = startPos.y + (endPosition.y - startPos.y) * progress

        // Add slight rotation and scale for visual effect
        const rotation = (progress - 0.5) * 10 // Slight rotation during animation
        const scale = 1 + Math.sin(progress * Math.PI) * 0.1 // Slight scale up then down

        // Use unique key with card data to prevent React key conflicts
        const cardKey = `anim-${index}-${card.type}-${card.number}-${Date.now()}`

        return (
          <div
            key={cardKey}
            className="absolute"
            style={{
              left: `${currentX}px`,
              top: `${currentY}px`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              zIndex: 10000 + index,
              transition: 'none', // Disable CSS transitions, we're using JS animation
              willChange: 'transform', // Optimize for animation
            }}
          >
            {displayCard.isSpecial ? (
              <div className="w-20 h-28 rounded-lg border-2 border-transparent card-shadow overflow-hidden">
                <img
                  src={`/imgs/cards/${displayCard.specialType}-0.png`}
                  alt={displayCard.specialType === 4 ? '소' : '따'}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            ) : (
              <Card suit={displayCard.suit} rank={displayCard.rank} />
            )}
          </div>
        )
      }).filter(Boolean)}
    </div>
  )
}

