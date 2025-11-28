import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface PlayerHandProps {
  cards: GameCard[]
  onCardSelectionChange?: (selectedCards: GameCard[]) => void
  isMyTurn?: boolean
  excludeCards?: GameCard[] // Cards to exclude from display (for animation)
}

export interface PlayerHandRef {
  getSelectedCardPositions: (selectedIndices: number[]) => Array<{ x: number; y: number }>
}

const PlayerHand = forwardRef<PlayerHandRef, PlayerHandProps>(({ 
  cards, 
  onCardSelectionChange, 
  isMyTurn = false,
  excludeCards = []
}, ref) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useImperativeHandle(ref, () => ({
    getSelectedCardPositions: (indices: number[]) => {
      // Use requestAnimationFrame to ensure DOM is ready
      return indices.map((index) => {
        const cardElement = cardRefs.current[index]
        if (cardElement) {
          // Force a reflow to ensure element is positioned
          cardElement.offsetHeight
          const rect = cardElement.getBoundingClientRect()
          // Account for scroll position
          return {
            // x: rect.left + rect.width / 2 + window.scrollX,
            // y: rect.top + rect.height / 2 + window.scrollY,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
        }
        // Return center of viewport as fallback
        return { 
          // x: window.innerWidth / 2 + window.scrollX, 
          // y: window.innerHeight / 2 + window.scrollY 
          x: window.innerWidth / 2, 
          y: window.innerHeight / 2, 
        }
      })
    },
  }))

  useEffect(() => {
    // Clear selection when it's not your turn
    if (!isMyTurn) {
      setSelectedIndices([])
    }
  }, [isMyTurn])

  useEffect(() => {
    // Notify parent of selection changes
    if (onCardSelectionChange) {
      const selectedCards: GameCard[] = selectedIndices
        .map((idx) => {
          // Ensure index is valid
          if (idx < 0 || idx >= cards.length) return null
          return cards[idx]
        })
        .filter((card): card is GameCard => card !== null)
        .filter((card) => {
          // Filter out excluded cards
          return !excludeCards.some(
            excluded => excluded.type === card.type && excluded.number === card.number
          )
        })
      onCardSelectionChange(selectedCards)
    }
  }, [selectedIndices, cards, onCardSelectionChange, excludeCards])

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

  // Filter out excluded cards - ensure proper comparison
  const displayCards = cards.filter((card) => {
    if (!card) return false
    const isExcluded = excludeCards.some(excluded => 
      excluded && excluded.type === card.type && excluded.number === card.number
    )
    return !isExcluded
  })

  if (!cards || cards.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-teal-300/70">No cards in hand</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-end relative min-h-[120px]">
        {displayCards.map((card, displayIndex) => {
          // Find original index in cards array
          let originalIndex = 0
          let skipped = 0
          for (let i = 0; i < cards.length; i++) {
            if (excludeCards.some(excluded => 
              excluded.type === cards[i].type && excluded.number === cards[i].number
            )) {
              skipped++
              continue
            }
            if (i - skipped === displayIndex) {
              originalIndex = i
              break
            }
          }

          const displayCard = convertCard(card)
          const isSelected = selectedIndices.includes(originalIndex) && 
            !excludeCards.some(excluded => 
              excluded.type === card.type && excluded.number === card.number
            )

          return (
            <div
              key={originalIndex}
              ref={(el) => {
                cardRefs.current[originalIndex] = el
              }}
              onClick={() => toggleCardSelection(originalIndex)}
              className={`relative ${
                displayIndex > 0 ? '-ml-[30px]' : ''
              } ${
                isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              style={{
                zIndex: displayIndex + 10,
              }}
            >
              {displayCard.isSpecial ? (
                <div
                  className={`w-20 h-28 rounded-lg border-2 ${
                    isSelected ? 'border-yellow-400 border-4' : 'border-transparent'
                  } card-shadow overflow-hidden ${
                    isSelected ? 'ring-4 ring-yellow-400/50' : ''
                  } transition-all duration-300 ease-in-out ${
                    !isSelected && isMyTurn ? 'hover:scale-110 hover:-translate-y-4 hover:shadow-2xl hover:shadow-yellow-400/50' : ''
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
                  isMyTurn={isMyTurn}
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
})

PlayerHand.displayName = 'PlayerHand'

export default PlayerHand


