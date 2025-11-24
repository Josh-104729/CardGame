interface CardProps {
  suit: number // 0: spades, 1: hearts, 2: diamonds, 3: clubs
  rank: number // 1-13 (A, 2-10, J, Q, K)
  isSelected?: boolean
  isFaceDown?: boolean
}

const suitSymbols = ['♠', '♥', '♦', '♣']
const suitColors = ['text-black', 'text-red-600', 'text-red-600', 'text-black']
const rankLabels: { [key: number]: string } = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K',
}

export default function Card({ suit, rank, isSelected = false, isFaceDown = false }: CardProps) {
  if (isFaceDown) {
    return (
      <div className="w-20 h-28 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg border-2 border-blue-600 card-shadow flex items-center justify-center">
        <div className="text-blue-300 text-2xl font-bold">🂠</div>
      </div>
    )
  }

  const suitSymbol = suitSymbols[suit]
  const suitColor = suitColors[suit]
  const rankLabel = rankLabels[rank] || rank.toString()

  return (
    <div
      className={`w-20 h-28 bg-white rounded-lg border-2 ${
        isSelected ? 'border-yellow-400 border-4' : 'border-gray-800'
      } card-shadow card-hover flex flex-col items-center justify-center p-2 ${
        isSelected ? 'ring-4 ring-yellow-400/50' : ''
      }`}
    >
      <div className={`text-lg font-bold ${suitColor}`}>{rankLabel}</div>
      <div className={`text-2xl ${suitColor}`}>{suitSymbol}</div>
    </div>
  )
}

