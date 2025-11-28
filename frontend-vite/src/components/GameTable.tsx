import { forwardRef, ReactNode } from 'react'
import Card from './Card'
import OpponentPlayer from './OpponentPlayer'
import type { Card as GameCard } from '../utils/cardValidation'

interface GameTableProps {
  centerCards?: GameCard[]
  opponents?: Array<{ name?: string; cardCount?: number; position?: 'top' | 'left' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; isActive?: boolean; progress?: number; isEmpty?: boolean; customPosition?: { x: number; y: number; usePercent?: boolean }; originalIndex?: number }>
  playerHand?: ReactNode
  gameControls?: ReactNode
  currentUserPlayer?: ReactNode // Current user's player item to display with PlayerHand
  onOpponentRef?: (index: number, element: HTMLDivElement | null) => void
}

const GameTable = forwardRef<HTMLDivElement, GameTableProps>(({ centerCards = [], opponents = [], playerHand, gameControls, currentUserPlayer, onOpponentRef }, ref) => {
  return (
    <div className="relative w-full max-w-6xl bg-teal-800/30 rounded-2xl border-4 border-teal-600/50 shadow-2xl">
      {/* Game Table Area */}
      <div className="relative w-full h-96 flex items-center justify-center">
        {/* Opponent Players */}
        {opponents.map((opponent, index) => {
          const originalIndex = opponent.originalIndex
          return (
            <div
              key={index}
              ref={(el) => {
                if (onOpponentRef && originalIndex !== undefined) {
                  onOpponentRef(originalIndex, el)
                }
              }}
            >
              <OpponentPlayer
                name={opponent.name}
                cardCount={opponent.cardCount}
                position={opponent.position}
                isActive={opponent.isActive}
                progress={opponent.progress}
                isEmpty={opponent.isEmpty}
                customPosition={opponent.customPosition}
              />
            </div>
          )
        })}

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

        {/* Game Controls - Positioned in center with highest z-index */}
        {gameControls && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
            {gameControls}
          </div>
        )}
      </div>

      {/* Current User Player Item and Player Hand - In one line at bottom */}
      {(currentUserPlayer || playerHand) && (
        <div className="w-full px-4 pb-4 pt-2">
          <div className="w-full flex items-center gap-6">
            {/* Current User Player Item - Left side */}
            {currentUserPlayer && (
              <div className="flex-shrink-0">
                {currentUserPlayer}
              </div>
            )}
            {/* Player Hand - Right side */}
            {playerHand && (
              <div className="flex-1 flex justify-end">
                {playerHand}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

GameTable.displayName = 'GameTable'

export default GameTable

