import { useState, useEffect } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface PlayerHandProps {
  cards: GameCard[]
  onCardSelectionChange?: (selectedCards: GameCard[]) => void
  isMyTurn?: boolean
}

export default function PlayerHand({ 
  cards, 
  onCardSelectionChange, 
  isMyTurn = false
}: PlayerHandProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])

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
    <div className="w-full">
      <div className="flex justify-center items-end relative min-h-[120px]">
        {cards.map((card, index) => {
          const displayCard = convertCard(card)
          const isSelected = selectedIndices.includes(index)
          // Overlap cards: each card overlaps the previous by 120px
          // First card has no negative margin

          return (
            <div
              key={index}
              onClick={() => toggleCardSelection(index)}
              className={`relative ${
                index > 0 ? '-ml-[30px]' : ''
              } ${
                isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${
                isSelected
                  ? 'z-50'
                  : isMyTurn
                  ? 'z-30'
                  : ''
              }`}
              style={{
                zIndex: isSelected ? 50 : index + 10,
              }}
            >
              {displayCard.isSpecial ? (
                <div
                  className={`w-20 h-28 rounded-lg border-2 ${
                    isSelected ? 'border-yellow-400 border-4' : 'border-transparent'
                  } card-shadow overflow-hidden ${
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

