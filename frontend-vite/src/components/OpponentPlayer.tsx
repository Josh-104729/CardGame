interface OpponentPlayerProps {
  name: string
  cardCount: number
  position: 'top' | 'left' | 'right'
  isActive?: boolean
}

export default function OpponentPlayer({ name, cardCount, position, isActive = false }: OpponentPlayerProps) {
  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
  }

  return (
    <div className={`absolute ${positionClasses[position]} ${isActive ? 'ring-4 ring-yellow-400 rounded-lg' : ''}`}>
      <div className="bg-teal-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border-2 border-teal-600">
        <div className="text-center">
          <div className="w-12 h-12 bg-teal-700 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-semibold">{name[0]}</span>
          </div>
          <div className="text-sm font-semibold text-white">{name}</div>
          <div className="text-xs text-teal-200 mt-1">{cardCount} cards</div>
          {isActive && (
            <div className="text-xs text-yellow-400 mt-1 font-bold">Active</div>
          )}
        </div>
      </div>
    </div>
  )
}

