import { useState, useEffect } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface PlayerHandProps {
  cards: GameCard[]
  onCardSelectionChange?: (selectedCards: GameCard[]) => void
  isMyTurn?: boolean
}

export default function PlayerHand({ cards, onCardSelectionChange, isMyTurn = false }: PlayerHandProps) {
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
      <div className="flex flex-wrap gap-2 justify-center items-end">
        {cards.map((card, index) => {
          const displayCard = convertCard(card)
          const isSelected = selectedIndices.includes(index)

          return (
            <div
              key={index}
              onClick={() => toggleCardSelection(index)}
              className={`transition-all duration-200 ${
                isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
              } ${
                isSelected
                  ? 'transform translate-y-[-20px] scale-110 z-10'
                  : isMyTurn
                  ? 'hover:translate-y-[-10px]'
                  : ''
              }`}
            >
              {displayCard.isSpecial ? (
                <div className="w-20 h-28 bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg border-2 border-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl">
                    {displayCard.specialType === 4 ? '소' : '따'}
                  </span>
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

