interface GameStatusProps {
  currentPlayer?: string
  lastPlay?: string
  round?: number
}

export default function GameStatus({ currentPlayer, lastPlay, round = 1 }: GameStatusProps) {
  return (
    <div className="bg-teal-800/50 rounded-lg p-4 mb-4 backdrop-blur-sm border border-teal-600">
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-teal-200">Round: </span>
          <span className="text-white font-semibold">{round}</span>
        </div>
        {currentPlayer && (
          <div>
            <span className="text-teal-200">Current Player: </span>
            <span className="text-white font-semibold">{currentPlayer}</span>
          </div>
        )}
        {lastPlay && (
          <div>
            <span className="text-teal-200">Last Play: </span>
            <span className="text-white font-semibold">{lastPlay}</span>
          </div>
        )}
      </div>
    </div>
  )
}

