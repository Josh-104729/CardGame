import { useState, useEffect, useRef } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface PlayerHandProps {
  cards: GameCard[]
  onCardSelectionChange?: (selectedCards: GameCard[]) => void
  isMyTurn?: boolean
  animateToCenter?: boolean
  onAnimationComplete?: () => void
  centerTargetRef?: React.RefObject<HTMLDivElement | null>
}

export default function PlayerHand({ 
  cards, 
  onCardSelectionChange, 
  isMyTurn = false,
  animateToCenter = false,
  onAnimationComplete,
  centerTargetRef
}: PlayerHandProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [animatingCards, setAnimatingCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clear selection when it's not your turn
    if (!isMyTurn) {
      setSelectedIndices([])
    }
  }, [isMyTurn])

  useEffect(() => {
    // Notify parent of selection changes
    if (onCardSelectionChange) {
      const selectedCards = selectedIndices.map((idx) => cards[idx]).filter(Boolean)
      onCardSelectionChange(selectedCards)
    }
  }, [selectedIndices, cards, onCardSelectionChange])

  // Handle animation trigger
  useEffect(() => {
    if (animateToCenter && selectedIndices.length > 0 && centerTargetRef?.current && containerRef.current) {
      const targetElement = centerTargetRef.current
      const targetRect = targetElement.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      
      // Calculate target position (center of game table)
      const targetX = targetRect.left + targetRect.width / 2 - containerRect.left
      const targetY = targetRect.top + targetRect.height / 2 - containerRect.top

      // Animate each selected card
      const cardsToAnimate = new Set(selectedIndices)
      setAnimatingCards(cardsToAnimate)

      selectedIndices.forEach((index, cardIndex) => {
        const cardElement = cardRefs.current.get(index)
        if (cardElement) {
          const cardRect = cardElement.getBoundingClientRect()
          const startX = cardRect.left + cardRect.width / 2 - containerRect.left
          const startY = cardRect.top + cardRect.height / 2 - containerRect.top

          // Calculate animation distance
          const deltaX = targetX - startX
          const deltaY = targetY - startY

          // Apply animation with slight stagger for multiple cards
          setTimeout(() => {
            cardElement.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out'
            cardElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.2)`
            cardElement.style.zIndex = '100'
            cardElement.style.opacity = '0.9'
          }, cardIndex * 50) // Stagger animation start by 50ms per card
        }
      })

      // Clean up after animation
      setTimeout(() => {
        // Reset card styles
        selectedIndices.forEach((index) => {
          const cardElement = cardRefs.current.get(index)
          if (cardElement) {
            cardElement.style.transition = ''
            cardElement.style.transform = ''
            cardElement.style.zIndex = ''
            cardElement.style.opacity = ''
          }
        })
        setAnimatingCards(new Set())
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }, 600 + (selectedIndices.length * 50)) // Wait for animation + stagger time
    }
  }, [animateToCenter, selectedIndices, centerTargetRef, onAnimationComplete])

  const toggleCardSelection = (index: number) => {
    if (!isMyTurn) return

    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
  }

  // Convert game card format to display format
  const convertCard = (card: GameCard) => {
    // type: 0-3 are suits, 4-5 are special
    if (card.type >= 4) {
      // Special card (Ta/So) - show as face down or special
      return { suit: 0, rank: 0, isSpecial: true, specialType: card.type }
    }
    return { suit: card.type, rank: card.number }
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-teal-300/70">No cards in hand</p>
      </div>
    )
  }

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex justify-center items-end relative min-h-[120px]">
        {cards.map((card, index) => {
          const displayCard = convertCard(card)
          const isSelected = selectedIndices.includes(index)
          const isAnimating = animatingCards.has(index)
          // Overlap cards: each card overlaps the previous by 120px
          // First card has no negative margin

          return (
            <div
              key={index}
              ref={(el) => {
                if (el) {
                  cardRefs.current.set(index, el)
                } else {
                  cardRefs.current.delete(index)
                }
              }}
              onClick={() => !isAnimating && toggleCardSelection(index)}
              className={`relative ${
                index > 0 ? '-ml-[0px]' : ''
              } ${
                isAnimating ? '' : 'transition-all duration-200'
              } ${
                isMyTurn && !isAnimating ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${
                isSelected && !isAnimating
                  ? 'transform translate-y-[-20px] scale-110 z-50'
                  : !isAnimating && isMyTurn
                  ? 'hover:translate-y-[-10px] hover:z-30'
                  : ''
              }`}
              style={{
                zIndex: isAnimating ? 100 : isSelected ? 50 : index + 10,
                pointerEvents: isAnimating ? 'none' : 'auto',
              }}
            >
              {displayCard.isSpecial ? (
                <div
                  className={`w-20 h-28 rounded-lg border-2 ${
                    isSelected ? 'border-yellow-400 border-4' : 'border-transparent'
                  } card-shadow card-hover overflow-hidden ${
                    isSelected ? 'ring-4 ring-yellow-400/50' : ''
                  }`}
                >
                  <img
                    src={`/imgs/cards/${displayCard.specialType}-0.png`}
                    alt={displayCard.specialType === 4 ? '소' : '따'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Card
                  suit={displayCard.suit}
                  rank={displayCard.rank}
                  isSelected={isSelected}
                />
              )}
            </div>
          )
        })}
      </div>
      {selectedIndices.length > 0 && isMyTurn && (
        <div className="mt-4 text-center text-teal-200">
          {selectedIndices.length} card(s) selected
        </div>
      )}
    </div>
  )
}

