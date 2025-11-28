interface OpponentPlayerProps {
  name?: string
  cardCount?: number
  position?: 'top' | 'left' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  isActive?: boolean
  progress?: number // Progress from 0 to 1 (0 = start, 1 = end of cooldown)
  isEmpty?: boolean // If true, shows an empty placeholder
  customPosition?: { x: number; y: number; usePercent?: boolean } // Custom calculated position (pixels or percent if usePercent=true)
  inline?: boolean // If true, uses relative positioning instead of absolute
}

export default function OpponentPlayer({ name, cardCount = 0, position, isActive = false, progress = 0, isEmpty = false, customPosition, inline = false }: OpponentPlayerProps) {
  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  // Calculate progress percentage (0 to 100)
  const progressPercent = Math.min(Math.max(progress * 100, 0), 100)

  // Use custom position if provided, otherwise use position classes
  const positionStyle = customPosition 
    ? { 
        left: customPosition.usePercent ? `${customPosition.x}%` : `${customPosition.x}px`, 
        top: customPosition.usePercent ? `${customPosition.y}%` : `${customPosition.y}px`,
        transform: 'translate(-50%, -50%)' // Center the player circle on the calculated point
      }
    : undefined

  const positionClassName = customPosition ? '' : (position ? positionClasses[position] : '')
  const containerClass = inline ? 'relative' : `absolute ${positionClassName}`

  if (isEmpty) {
    // Empty placeholder
    return (
      <div className={containerClass} style={inline ? undefined : positionStyle}>
        <div className="w-32 h-32 bg-teal-800/40 backdrop-blur-sm rounded-full shadow-lg border-2 border-dashed border-teal-600/50 relative flex items-center justify-center opacity-60">
          <div className="text-center relative z-10 flex flex-col items-center justify-center px-2">
            <div className="w-14 h-14 bg-teal-700/50 rounded-full flex items-center justify-center mb-1.5 border-2 border-dashed border-teal-500/50">
              <span className="text-teal-400/50 font-semibold text-base">?</span>
            </div>
            <div className="text-sm font-semibold text-teal-300/50 truncate max-w-[110px]">Waiting...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass} style={inline ? undefined : positionStyle} data-player-name={name}>
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
            <span className="text-white font-semibold text-base">{name?.[0] || '?'}</span>
          </div>
          <div className="text-sm font-semibold text-white truncate max-w-[110px]">{name || 'Unknown'}</div>
          <div className="text-xs text-teal-200 mt-0.5">{cardCount} cards</div>
          {isActive && (
            <div className="text-xs text-yellow-400 mt-0.5 font-bold">Active</div>
          )}
        </div>
      </div>
    </div>
  )
}

