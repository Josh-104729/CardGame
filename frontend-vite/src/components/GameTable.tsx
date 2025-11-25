import Card from './Card'
import OpponentPlayer from './OpponentPlayer'
import type { Card as GameCard } from '../utils/cardValidation'

interface GameTableProps {
  centerCards?: GameCard[]
  opponents?: Array<{ name: string; cardCount: number; position: 'top' | 'left' | 'right'; isActive?: boolean }>
}

export default function GameTable({ centerCards = [], opponents = [] }: GameTableProps) {
  return (
    <div className="relative w-full max-w-5xl h-96 bg-teal-800/30 rounded-2xl border-4 border-teal-600/50 shadow-2xl flex items-center justify-center">
      {/* Opponent Players */}
      {opponents.map((opponent, index) => (
        <OpponentPlayer
          key={index}
          name={opponent.name}
          cardCount={opponent.cardCount}
          position={opponent.position}
          isActive={opponent.isActive}
        />
      ))}

      {/* Center Cards */}
      <div className="z-10">
        {centerCards && centerCards.length > 0 ? (
          <div className="flex gap-4 items-center justify-center">
            {centerCards.map((card, index) => {
              // Convert game card format to display format
              if (card.type >= 4) {
                // Special card (Ta/So)
                return (
                  <div
                    key={index}
                    className="w-20 h-28 bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg border-2 border-purple-500 flex items-center justify-center"
                  >
                    <span className="text-white text-xl">
                      {card.type === 4 ? '소' : '따'}
                    </span>
                  </div>
                )
              }
              return <Card key={index} suit={card.type} rank={card.number} />
            })}
          </div>
        ) : (
          <div className="text-teal-300/50 text-lg font-semibold">
            Play your cards here
          </div>
        )}
      </div>
    </div>
  )
}

