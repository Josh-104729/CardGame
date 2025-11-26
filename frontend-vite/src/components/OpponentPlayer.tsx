interface OpponentPlayerProps {
  name: string
  cardCount: number
  position: 'top' | 'left' | 'right'
  isActive?: boolean
  progress?: number // Progress from 0 to 1 (0 = start, 1 = end of cooldown)
}

export default function OpponentPlayer({ name, cardCount, position, isActive = false, progress = 0 }: OpponentPlayerProps) {
  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
  }

  // Calculate progress percentage (0 to 100)
  const progressPercent = Math.min(Math.max(progress * 100, 0), 100)

  return (
    <div className={`absolute ${positionClasses[position]}`}>
      <div className={`w-32 h-32 bg-teal-800/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-teal-600 relative flex items-center justify-center ${isActive ? 'cooldown-effect' : ''}`}>
        {/* Progress bar overlay for cooldown effect */}
        {isActive && (
          <div className="absolute -top-[8px] -left-[8px] -right-[8px] -bottom-[8px] rounded-full pointer-events-none z-0 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="5"
              />
              {/* Progress circle with white opacity */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255, 255, 255, 0.85)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progressPercent / 100)}`}
                className="transition-all duration-1000 ease-linear"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))',
                }}
              />
            </svg>
            <div className="absolute inset-[5px] rounded-full bg-teal-800/90"></div>
          </div>
        )}
        <div className="text-center relative z-10 flex flex-col items-center justify-center px-2">
          <div className="w-14 h-14 bg-teal-700 rounded-full flex items-center justify-center mb-1.5">
            <span className="text-white font-semibold text-base">{name[0]}</span>
          </div>
          <div className="text-sm font-semibold text-white truncate max-w-[110px]">{name}</div>
          <div className="text-xs text-teal-200 mt-0.5">{cardCount} cards</div>
          {isActive && (
            <div className="text-xs text-yellow-400 mt-0.5 font-bold">Active</div>
          )}
        </div>
      </div>
    </div>
  )
}

