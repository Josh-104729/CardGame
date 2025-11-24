import { useState } from 'react'
import Card from './Card'

interface CardType {
  suit: number
  rank: number
}

interface PlayerHandProps {
  cards?: CardType[]
}

export default function PlayerHand({ cards: initialCards }: PlayerHandProps) {
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [cards] = useState<CardType[]>(
    initialCards || [
      { suit: 0, rank: 1 },
      { suit: 1, rank: 5 },
      { suit: 2, rank: 10 },
      { suit: 3, rank: 13 },
      { suit: 0, rank: 7 },
      { suit: 1, rank: 2 },
      { suit: 2, rank: 8 },
    ]
  )

  const toggleCardSelection = (index: number) => {
    setSelectedCards((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center items-end">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => toggleCardSelection(index)}
            className={`cursor-pointer transition-all duration-200 ${
              selectedCards.includes(index)
                ? 'transform translate-y-[-20px] scale-110 z-10'
                : 'hover:translate-y-[-10px]'
            }`}
          >
            <Card
              suit={card.suit}
              rank={card.rank}
              isSelected={selectedCards.includes(index)}
            />
          </div>
        ))}
      </div>
      {selectedCards.length > 0 && (
        <div className="mt-4 text-center text-teal-200">
          {selectedCards.length} card(s) selected
        </div>
      )}
    </div>
  )
}

