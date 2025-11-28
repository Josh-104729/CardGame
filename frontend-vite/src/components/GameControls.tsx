interface GameControlsProps {
  onPlayCards: () => void
  onPass: () => void
  onExit: () => void
  canPlay: boolean
  canPass: boolean
  isMyTurn: boolean | undefined
}

export default function GameControls({
  onPlayCards,
  onPass,
  onExit,
  canPlay,
  canPass,
  isMyTurn,
}: GameControlsProps) {
  if (!isMyTurn) {
    return null
  }

  return (
    <div className="flex gap-4 items-center justify-center">
      <button
        onClick={onPlayCards}
        disabled={!canPlay}
        className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 ${
          canPlay
            ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white hover:scale-105'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Play Cards
      </button>
      <button
        onClick={onPass}
        disabled={!canPass}
        className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 ${
          canPass
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
  )
}

