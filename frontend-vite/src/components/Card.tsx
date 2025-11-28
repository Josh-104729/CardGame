interface CardProps {
  suit: number // 0: spades, 1: hearts, 2: diamonds, 3: clubs
  rank: number // 1-13 (internal rank: 1=3, 2=4, ..., 8=10, 9=J, 10=Q, 11=K, 12=A, 13=2)
  isSelected?: boolean
  isFaceDown?: boolean
}

// Map internal rank to real card rank
// Internal: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
// Real:     3, 4, 5, 6, 7, 8, 9, 10, J(11), Q(12), K(13), A(1), 2
const mapInternalRankToRealRank = (internalRank: number): number => {
  if (internalRank >= 1 && internalRank <= 8) {
    // Internal 1-8 maps to Real 3-10
    return internalRank + 2
  } else if (internalRank === 9) {
    // Internal 9 maps to Real J (11)
    return 11
  } else if (internalRank === 10) {
    // Internal 10 maps to Real Q (12)
    return 12
  } else if (internalRank === 11) {
    // Internal 11 maps to Real K (13)
    return 13
  } else if (internalRank === 12) {
    // Internal 12 maps to Real A (1)
    return 1
  } else if (internalRank === 13) {
    // Internal 13 maps to Real 2
    return 2
  }
  return internalRank // Fallback
}

export default function Card({ suit, rank, isSelected = false, isFaceDown = false }: CardProps) {
  // Get card image path
  const getCardImagePath = () => {
    if (isFaceDown) {
      return '/imgs/cards/coveredCardBg.png'
    }
    const realRank = mapInternalRankToRealRank(rank)
    return `/imgs/cards/${suit}-${realRank}.png`
  }

  return (
    <div
      className={`w-20 h-28 rounded-lg border-2 ${
        isSelected ? 'border-yellow-400 border-4' : 'border-transparent'
      } ${isFaceDown ? '' : 'card-shadow'} overflow-hidden ${
        isSelected ? 'ring-4 ring-yellow-400/50' : ''
      }`}
    >
      <img
        src={getCardImagePath()}
        alt={`Card ${suit}-${rank}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image doesn't exist
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            const realRank = mapInternalRankToRealRank(rank)
            const rankLabel = realRank === 1 ? 'A' : realRank === 11 ? 'J' : realRank === 12 ? 'Q' : realRank === 13 ? 'K' : realRank.toString()
            parent.innerHTML = `
              <div class="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-2">
                <div class="text-lg font-bold">${rankLabel}</div>
                <div class="text-2xl">${['♠', '♥', '♦', '♣'][suit]}</div>
              </div>
            `
          }
        }}
      />
    </div>
  )
}

