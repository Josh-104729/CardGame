interface GameControlsProps {
  onPlayCards: () => void
  onPass: () => void
  onExit: () => void
  onPause?: () => void
  canPlay: boolean
  canPass: boolean
  isMyTurn: boolean | undefined
  isHost?: boolean
  isPaused?: boolean
}

export default function GameControls({
  onPlayCards,
  onPass,
  onExit,
  onPause,
  canPlay,
  canPass,
  isMyTurn,
  isHost = false,
  isPaused = false,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      {/* Player controls - only show when it's your turn */}
      {isMyTurn && (
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={onPlayCards}
            disabled={!canPlay || isPaused}
            className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 ${
              canPlay && !isPaused
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Play Cards
          </button>
          <button
            onClick={onPass}
            disabled={!canPass || isPaused}
            className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 ${
              canPass && !isPaused
                ? 'bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Pass
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
          >
            Exit
          </button>
        </div>
      )}
      
      {/* Host pause button - always visible to host */}
      {isHost && onPause && (
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={onPause}
            className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 ${
              isPaused
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white hover:scale-105'
                : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white hover:scale-105'
            }`}
          >
            {isPaused ? 'Resume Game' : 'Pause Game'}
          </button>
        </div>
      )}
    </div>
  )
}

