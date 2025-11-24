import Card from './Card'
import OpponentPlayer from './OpponentPlayer'

interface GameTableProps {
  centerCards?: Array<{ suit: number; rank: number }>
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
        {centerCards.length > 0 ? (
          <div className="flex gap-4 items-center justify-center">
            {centerCards.map((card, index) => (
              <Card key={index} suit={card.suit} rank={card.rank} />
            ))}
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

