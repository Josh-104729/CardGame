import { forwardRef } from 'react'
import Card from './Card'
import OpponentPlayer from './OpponentPlayer'
import type { Card as GameCard } from '../utils/cardValidation'

interface GameTableProps {
  centerCards?: GameCard[]
  opponents?: Array<{ name?: string; cardCount?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; isActive?: boolean; progress?: number; isEmpty?: boolean; customPosition?: { x: number; y: number; usePercent?: boolean } }>
}

const GameTable = forwardRef<HTMLDivElement, GameTableProps>(({ centerCards = [], opponents = [] }, ref) => {
  return (
    <div className="relative w-full max-w-6xl h-96 bg-teal-800/30 rounded-2xl border-4 border-teal-600/50 shadow-2xl flex items-center justify-center">
      {/* Opponent Players */}
      {opponents.map((opponent, index) => (
        <OpponentPlayer
          key={index}
          name={opponent.name}
          cardCount={opponent.cardCount}
          position={opponent.position}
          isActive={opponent.isActive}
          progress={opponent.progress}
          isEmpty={opponent.isEmpty}
          customPosition={opponent.customPosition}
        />
      ))}

      {/* Center Cards */}
      <div ref={ref} className="z-10">
        {centerCards && centerCards.length > 0 ? (
          <div className="flex gap-4 items-center justify-center">
            {centerCards.map((card, index) => {
              // Convert game card format to display format
              if (card.type >= 4) {
                // Special card (Ta/So)
                return (
                  <div
                    key={index}
                    className="w-20 h-28 rounded-lg border-2 border-transparent card-shadow overflow-hidden"
                  >
                    <img
                      src={`/imgs/cards/${card.type}-0.png`}
                      alt={card.type === 4 ? '소' : '따'}
                      className="w-full h-full object-cover"
                    />
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
})

GameTable.displayName = 'GameTable'

export default GameTable

