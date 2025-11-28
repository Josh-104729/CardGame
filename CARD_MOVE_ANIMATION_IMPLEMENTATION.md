# Card Move Animation Implementation Guide

This guide explains how to implement the `CardMoveAnimation` component that animates cards moving from PlayerHand to Center Cards when the "Play Cards" button is clicked.

## Overview

The animation should:
1. Show selected cards smoothly moving from their positions in PlayerHand to the center cards area
2. Remove cards from PlayerHand when animation starts
3. Display cards in Center Cards when animation finishes
4. Work without callback errors

## Implementation Steps

### Step 1: Create the CardMoveAnimation Component

Create a new file: `frontend-vite/src/components/CardMoveAnimation.tsx`

```tsx
import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface CardMoveAnimationProps {
  cards: GameCard[]
  startPositions: Array<{ x: number; y: number }>
  endPosition: { x: number; y: number }
  onAnimationComplete: () => void
  isAnimating: boolean
}

export default function CardMoveAnimation({
  cards,
  startPositions,
  endPosition,
  onAnimationComplete,
  isAnimating,
}: CardMoveAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'animating' | 'complete'>('idle')
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isAnimating) {
      setAnimationPhase('idle')
      return
    }

    // Start animation
    setAnimationPhase('animating')

    // Animation duration in milliseconds
    const duration = 800

    // Use requestAnimationFrame for smooth animation
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation (ease-in-out)
      const easeInOut = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setAnimationPhase('complete')
        // Call completion callback after a small delay to ensure visual update
        setTimeout(() => {
          onAnimationComplete()
        }, 50)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, onAnimationComplete])

  if (!isAnimating || animationPhase === 'idle') {
    return null
  }

  // Convert game card format to display format
  const convertCard = (card: GameCard) => {
    if (card.type >= 4) {
      return { suit: 0, rank: 0, isSpecial: true, specialType: card.type }
    }
    return { suit: card.type, rank: card.number }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {cards.map((card, index) => {
        const displayCard = convertCard(card)
        const startPos = startPositions[index] || { x: 0, y: 0 }
        
        // Calculate current position based on animation progress
        const currentX = animationPhase === 'animating'
          ? startPos.x + (endPosition.x - startPos.x) * 0.5 // Mid-animation
          : endPosition.x
        const currentY = animationPhase === 'animating'
          ? startPos.y + (endPosition.y - startPos.y) * 0.5 // Mid-animation
          : endPosition.y

        return (
          <div
            key={`anim-${index}`}
            className="absolute transition-all duration-300 ease-in-out"
            style={{
              left: `${currentX}px`,
              top: `${currentY}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10000 + index,
            }}
          >
            {displayCard.isSpecial ? (
              <div className="w-20 h-28 rounded-lg border-2 border-transparent card-shadow overflow-hidden">
                <img
                  src={`/imgs/cards/${displayCard.specialType}-0.png`}
                  alt={displayCard.specialType === 4 ? '소' : '따'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Card suit={displayCard.suit} rank={displayCard.rank} />
            )}
          </div>
        )
      })}
    </div>
  )
}
```

### Step 2: Enhanced CardMoveAnimation with Proper Animation

The above component uses a simplified approach. For a smoother animation, use this enhanced version:

```tsx
import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface CardMoveAnimationProps {
  cards: GameCard[]
  startPositions: Array<{ x: number; y: number }>
  endPosition: { x: number; y: number }
  onAnimationComplete: () => void
  isAnimating: boolean
}

export default function CardMoveAnimation({
  cards,
  startPositions,
  endPosition,
  onAnimationComplete,
  isAnimating,
}: CardMoveAnimationProps) {
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isAnimating) {
      setProgress(0)
      return
    }

    const duration = 800 // milliseconds
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const currentProgress = Math.min(elapsed / duration, 1)

      // Ease-in-out cubic function for smooth animation
      const easeInOutCubic = currentProgress < 0.5
        ? 4 * currentProgress * currentProgress * currentProgress
        : 1 - Math.pow(-2 * currentProgress + 2, 3) / 2

      setProgress(easeInOutCubic)

      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setTimeout(() => {
          onAnimationComplete()
        }, 50)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, onAnimationComplete])

  if (!isAnimating || cards.length === 0) {
    return null
  }

  const convertCard = (card: GameCard) => {
    if (card.type >= 4) {
      return { suit: 0, rank: 0, isSpecial: true, specialType: card.type }
    }
    return { suit: card.type, rank: card.number }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {cards.map((card, index) => {
        const displayCard = convertCard(card)
        const startPos = startPositions[index] || { x: 0, y: 0 }
        
        // Calculate current position with easing
        const currentX = startPos.x + (endPosition.x - startPos.x) * progress
        const currentY = startPos.y + (endPosition.y - startPos.y) * progress

        // Add slight rotation and scale for visual effect
        const rotation = (progress - 0.5) * 10 // Slight rotation during animation
        const scale = 1 + Math.sin(progress * Math.PI) * 0.1 // Slight scale up then down

        return (
          <div
            key={`anim-${index}`}
            className="absolute"
            style={{
              left: `${currentX}px`,
              top: `${currentY}px`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              zIndex: 10000 + index,
              transition: 'none', // Disable CSS transitions, we're using JS animation
            }}
          >
            {displayCard.isSpecial ? (
              <div className="w-20 h-28 rounded-lg border-2 border-transparent card-shadow overflow-hidden">
                <img
                  src={`/imgs/cards/${displayCard.specialType}-0.png`}
                  alt={displayCard.specialType === 4 ? '소' : '따'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Card suit={displayCard.suit} rank={displayCard.rank} />
            )}
          </div>
        )
      })}
    </div>
  )
}
```

### Step 3: Update PlayerHand Component

Modify `PlayerHand.tsx` to expose card positions via refs:

```tsx
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Card from './Card'
import type { Card as GameCard } from '../utils/cardValidation'

interface PlayerHandProps {
  cards: GameCard[]
  onCardSelectionChange?: (selectedCards: GameCard[]) => void
  isMyTurn?: boolean
  excludeCards?: GameCard[] // Cards to exclude from display (for animation)
}

export interface PlayerHandRef {
  getSelectedCardPositions: (selectedIndices: number[]) => Array<{ x: number; y: number }>
}

const PlayerHand = forwardRef<PlayerHandRef, PlayerHandProps>(({ 
  cards, 
  onCardSelectionChange, 
  isMyTurn = false,
  excludeCards = []
}, ref) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useImperativeHandle(ref, () => ({
    getSelectedCardPositions: (indices: number[]) => {
      return indices.map((index) => {
        const cardElement = cardRefs.current[index]
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect()
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
        }
        return { x: 0, y: 0 }
      })
    },
  }))

  useEffect(() => {
    if (!isMyTurn) {
      setSelectedIndices([])
    }
  }, [isMyTurn])

  useEffect(() => {
    if (onCardSelectionChange) {
      const selectedCards = selectedIndices.map((idx) => cards[idx]).filter(Boolean)
      onCardSelectionChange(selectedCards)
    }
  }, [selectedIndices, cards, onCardSelectionChange])

  const toggleCardSelection = (index: number) => {
    if (!isMyTurn) return

    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
  }

  const convertCard = (card: GameCard) => {
    if (card.type >= 4) {
      return { suit: 0, rank: 0, isSpecial: true, specialType: card.type }
    }
    return { suit: card.type, rank: card.number }
  }

  // Filter out excluded cards
  const displayCards = cards.filter((card, index) => {
    return !excludeCards.some(excluded => 
      excluded.type === card.type && excluded.number === card.number
    )
  })

  if (!cards || cards.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-teal-300/70">No cards in hand</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-end relative min-h-[120px]">
        {displayCards.map((card, displayIndex) => {
          // Find original index in cards array
          let originalIndex = 0
          let skipped = 0
          for (let i = 0; i < cards.length; i++) {
            if (excludeCards.some(excluded => 
              excluded.type === cards[i].type && excluded.number === cards[i].number
            )) {
              skipped++
              continue
            }
            if (i - skipped === displayIndex) {
              originalIndex = i
              break
            }
          }

          const displayCard = convertCard(card)
          const isSelected = selectedIndices.includes(originalIndex) && 
            !excludeCards.some(excluded => 
              excluded.type === card.type && excluded.number === card.number
            )

          return (
            <div
              key={originalIndex}
              ref={(el) => {
                cardRefs.current[originalIndex] = el
              }}
              onClick={() => toggleCardSelection(originalIndex)}
              className={`relative ${
                displayIndex > 0 ? '-ml-[30px]' : ''
              } ${
                isMyTurn ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${
                isSelected
                  ? 'z-50'
                  : isMyTurn
                  ? 'z-30'
                  : ''
              }`}
              style={{
                zIndex: isSelected ? 50 : displayIndex + 10,
              }}
            >
              {displayCard.isSpecial ? (
                <div
                  className={`w-20 h-28 rounded-lg border-2 ${
                    isSelected ? 'border-yellow-400 border-4' : 'border-transparent'
                  } card-shadow overflow-hidden ${
                    isSelected ? 'ring-4 ring-yellow-400/50' : ''
                  }`}
                >
                  <img
                    src={`/imgs/cards/${displayCard.specialType}-0.png`}
                    alt={displayCard.specialType === 4 ? '소' : '따'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Card
                  suit={displayCard.suit}
                  rank={displayCard.rank}
                  isSelected={isSelected}
                />
              )}
            </div>
          )
        })}
      </div>
      {selectedIndices.length > 0 && isMyTurn && (
        <div className="mt-4 text-center text-teal-200">
          {selectedIndices.length} card(s) selected
        </div>
      )}
    </div>
  )
})

PlayerHand.displayName = 'PlayerHand'

export default PlayerHand
```

### Step 4: Update GamePage Component

Modify `GamePage.tsx` to integrate the animation:

```tsx
// Add these imports at the top
import CardMoveAnimation from '../components/CardMoveAnimation'
import type { PlayerHandRef } from '../components/PlayerHand'

// Add these state variables and refs after existing useState declarations
const [isAnimating, setIsAnimating] = useState(false)
const [animatingCards, setAnimatingCards] = useState<Card[]>([])
const [cardStartPositions, setCardStartPositions] = useState<Array<{ x: number; y: number }>>([])
const [cardEndPosition, setCardEndPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
const [excludedCards, setExcludedCards] = useState<Card[]>([])
const playerHandRef = useRef<PlayerHandRef>(null)
const pendingEmitRef = useRef<{
  choosedCard: Card[]
  roomId: number
  double: number
  effectOpen: boolean
  effectkind: string
} | null>(null)

// Update handlePlayCards function
const handlePlayCards = () => {
  if (!socketRef.current || !roomId || selectedCards.length === 0 || !canPlay) {
    return
  }

  const validation = guessValidationCheck(selectedCards)
  if (validation.status === 0) {
    setError(validation.msg)
    return
  }

  // Prepare emit data first
  let double = roomData?.double || 1
  let effectOpen = false
  let effectkind = ''

  if (validation.status === 3) {
    double *= 2
    effectOpen = true
    effectkind = 'madae'
  } else if (validation.status === 4) {
    double *= 2
    effectOpen = true
    effectkind = 'tawang'
  }

  // Store emit data in ref (will be used after animation completes)
  pendingEmitRef.current = {
    choosedCard: selectedCards,
    roomId: parseInt(roomId, 10),
    double: double,
    effectOpen: effectOpen,
    effectkind: effectkind,
  }

  // Get card positions from PlayerHand for animation
  if (playerHandRef.current && selectedCards.length > 0) {
    // Get selected card indices
    const selectedIndices: number[] = []
    const myCards = myIndex >= 0 && roomData?.havingCards ? roomData.havingCards[myIndex] || [] : []
    
    selectedCards.forEach((selectedCard) => {
      const index = myCards.findIndex(
        (card) => card.type === selectedCard.type && card.number === selectedCard.number
      )
      if (index !== -1) {
        selectedIndices.push(index)
      }
    })

    // Get start positions
    const startPositions = playerHandRef.current.getSelectedCardPositions(selectedIndices)
    
    // Get end position (center cards area)
    if (centerCardsRef.current) {
      const centerRect = centerCardsRef.current.getBoundingClientRect()
      const endX = centerRect.left + centerRect.width / 2
      const endY = centerRect.top + centerRect.height / 2
      
      setCardStartPositions(startPositions)
      setCardEndPosition({ x: endX, y: endY })
      setAnimatingCards([...selectedCards])
      setExcludedCards([...selectedCards]) // Exclude cards from PlayerHand
      setIsAnimating(true)
      setSelectedCards([]) // Clear selection
      return // Exit early, animation will trigger emit via handleAnimationComplete
    }
  }

  // Fallback: emit immediately if animation setup fails
  if (pendingEmitRef.current && socketRef.current) {
    socketRef.current.emit('shutcards', pendingEmitRef.current)
    pendingEmitRef.current = null
    setSelectedCards([])
  }
}

// Add animation complete handler
const handleAnimationComplete = () => {
  setIsAnimating(false)
  setAnimatingCards([])
  setExcludedCards([])
  
  // Emit socket event after animation completes
  if (pendingEmitRef.current && socketRef.current) {
    socketRef.current.emit('shutcards', pendingEmitRef.current)
    pendingEmitRef.current = null
  }
}

// Update PlayerHand component usage
<PlayerHand
  ref={playerHandRef}
  cards={myCards}
  onCardSelectionChange={handleCardSelectionChange}
  isMyTurn={isMyTurn}
  excludeCards={excludedCards}
/>

// Add CardMoveAnimation component before closing ProtectedRoute
<CardMoveAnimation
  cards={animatingCards}
  startPositions={cardStartPositions}
  endPosition={cardEndPosition}
  onAnimationComplete={handleAnimationComplete}
  isAnimating={isAnimating}
/>
```

### Step 5: Complete GamePage Integration

Here's the complete updated section for GamePage.tsx:

```tsx
// At the top, add:
import CardMoveAnimation from '../components/CardMoveAnimation'
import PlayerHand, { type PlayerHandRef } from '../components/PlayerHand'

// Add refs and state:
const playerHandRef = useRef<PlayerHandRef>(null)
const pendingEmitRef = useRef<{
  choosedCard: Card[]
  roomId: number
  double: number
  effectOpen: boolean
  effectkind: string
} | null>(null)

const [isAnimating, setIsAnimating] = useState(false)
const [animatingCards, setAnimatingCards] = useState<Card[]>([])
const [cardStartPositions, setCardStartPositions] = useState<Array<{ x: number; y: number }>>([])
const [cardEndPosition, setCardEndPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
const [excludedCards, setExcludedCards] = useState<Card[]>([])

// Update handlePlayCards:
const handlePlayCards = () => {
  if (!socketRef.current || !roomId || selectedCards.length === 0 || !canPlay || isAnimating) {
    return
  }

  const validation = guessValidationCheck(selectedCards)
  if (validation.status === 0) {
    setError(validation.msg)
    return
  }

  // Prepare emit data
  let double = roomData?.double || 1
  let effectOpen = false
  let effectkind = ''

  if (validation.status === 3) {
    double *= 2
    effectOpen = true
    effectkind = 'madae'
  } else if (validation.status === 4) {
    double *= 2
    effectOpen = true
    effectkind = 'tawang'
  }

  // Store emit data
  pendingEmitRef.current = {
    choosedCard: selectedCards,
    roomId: parseInt(roomId, 10),
    double: double,
    effectOpen: effectOpen,
    effectkind: effectkind,
  }

  // Get card positions for animation
  if (playerHandRef.current && centerCardsRef.current && selectedCards.length > 0) {
    const myCards = myIndex >= 0 && roomData?.havingCards ? roomData.havingCards[myIndex] || [] : []
    
    // Find indices of selected cards
    const selectedIndices: number[] = []
    selectedCards.forEach((selectedCard) => {
      const index = myCards.findIndex(
        (card) => card.type === selectedCard.type && card.number === selectedCard.number
      )
      if (index !== -1) {
        selectedIndices.push(index)
      }
    })

    if (selectedIndices.length > 0) {
      // Get start positions
      const startPositions = playerHandRef.current.getSelectedCardPositions(selectedIndices)
      
      // Get end position
      const centerRect = centerCardsRef.current.getBoundingClientRect()
      const endX = centerRect.left + centerRect.width / 2
      const endY = centerRect.top + centerRect.height / 2
      
      setCardStartPositions(startPositions)
      setCardEndPosition({ x: endX, y: endY })
      setAnimatingCards([...selectedCards])
      setExcludedCards([...selectedCards])
      setIsAnimating(true)
      setSelectedCards([]) // Clear selection immediately
      return // Exit early, animation will trigger emit
    }
  }

  // Fallback: emit immediately if animation setup fails
  if (pendingEmitRef.current) {
    socketRef.current?.emit('shutcards', pendingEmitRef.current)
    pendingEmitRef.current = null
    setSelectedCards([])
  }
}

// Add animation complete handler
const handleAnimationComplete = () => {
  setIsAnimating(false)
  
  // Emit socket event after animation completes
  if (pendingEmitRef.current && socketRef.current) {
    socketRef.current.emit('shutcards', pendingEmitRef.current)
    pendingEmitRef.current = null
  }
  
  // Clear animation state after a brief delay
  setTimeout(() => {
    setAnimatingCards([])
    setExcludedCards([])
    setCardStartPositions([])
  }, 100)
}

// Update PlayerHand in JSX:
playerHand={
  roomData?.isStart ? (
    <PlayerHand
      ref={playerHandRef}
      cards={myCards}
      onCardSelectionChange={handleCardSelectionChange}
      isMyTurn={isMyTurn}
      excludeCards={excludedCards}
    />
  ) : undefined
}

// Add CardMoveAnimation before closing ProtectedRoute div:
<CardMoveAnimation
  cards={animatingCards}
  startPositions={cardStartPositions}
  endPosition={cardEndPosition}
  onAnimationComplete={handleAnimationComplete}
  isAnimating={isAnimating}
/>
```

## Key Points

1. **Timing**: Cards are removed from PlayerHand immediately when animation starts (via `excludedCards` prop)
2. **Animation**: Cards animate smoothly using `requestAnimationFrame` with easing
3. **Completion**: Cards appear in Center Cards when socket update arrives (handled by existing `update` event)
4. **No Callback Errors**: Using refs and proper cleanup to avoid stale closures

## Testing Checklist

- [ ] Cards animate smoothly from hand to center
- [ ] Selected cards disappear from hand immediately
- [ ] Cards appear in center after animation
- [ ] No console errors or warnings
- [ ] Animation works with multiple cards
- [ ] Animation works with special cards (Ta/So)
- [ ] Socket emit happens after animation completes
- [ ] Game state updates correctly after animation

## Troubleshooting

### 1. Cards not animating

**Symptoms**: Cards don't move when "Play Cards" button is clicked

**Solutions**:
- Check browser console for errors
- Verify `isAnimating` state is being set to `true` in `handlePlayCards`
- Ensure `playerHandRef.current` and `centerCardsRef.current` are not null
- Check that `selectedCards.length > 0` before animation starts
- Verify `startPositions` array has valid coordinates (not all zeros)
- Add console.log to debug: `console.log('Animation starting:', { isAnimating, startPositions, endPosition })`

**Common causes**:
- Refs not properly attached (check PlayerHand has `ref={playerHandRef}`)
- Elements not mounted when `getBoundingClientRect()` is called
- Animation state not updating due to React batching

### 2. Position errors

**Symptoms**: Cards animate from wrong position or to wrong destination

**Solutions**:
- Ensure `getBoundingClientRect()` is called after DOM elements are rendered
- Use `useEffect` with proper dependencies to wait for mount
- Check that `cardRefs.current[index]` is not null before getting position
- Verify viewport hasn't scrolled (positions are relative to viewport)
- Add offset calculation if needed: `window.scrollX` and `window.scrollY`

**Debug code**:
```tsx
// In PlayerHand getSelectedCardPositions:
const rect = cardElement.getBoundingClientRect()
console.log('Card position:', { 
  left: rect.left, 
  top: rect.top, 
  width: rect.width, 
  height: rect.height 
})
```

### 3. Cards not disappearing from hand

**Symptoms**: Cards remain visible in PlayerHand during animation

**Solutions**:
- Verify `excludedCards` prop is passed to PlayerHand
- Check that card comparison logic matches (type and number)
- Ensure `excludedCards` state is set before `isAnimating` is set to true
- Verify `displayCards` filter is working correctly
- Check that original index mapping is correct when cards are excluded

**Debug code**:
```tsx
// In PlayerHand component:
console.log('Excluded cards:', excludeCards)
console.log('Display cards count:', displayCards.length, 'Total cards:', cards.length)
```

### 4. Animation too fast/slow

**Symptoms**: Animation completes too quickly or takes too long

**Solutions**:
- Adjust `duration` constant in `CardMoveAnimation.tsx` (default: 800ms)
- For faster: `const duration = 500`
- For slower: `const duration = 1200`
- Consider making it configurable via props
- Test on different devices (mobile may need different timing)

### 5. Z-index issues

**Symptoms**: Animation cards appear behind other elements

**Solutions**:
- Ensure animation container has `z-[10000]` or higher
- Check that no other elements have higher z-index
- Verify `pointer-events-none` is set on animation container
- Use `fixed` positioning instead of `absolute` if needed
- Check parent containers don't have `overflow: hidden` that clips animation

### 6. Callback errors / Stale closures

**Symptoms**: `onAnimationComplete` not called or called with wrong state

**Solutions**:
- Use `useRef` to store callback: `const onCompleteRef = useRef(onAnimationComplete)`
- Update ref in `useEffect`: `onCompleteRef.current = onAnimationComplete`
- Call via ref: `onCompleteRef.current()` instead of `onAnimationComplete()`
- Ensure cleanup in `useEffect` cancels animation frame
- Check that `pendingEmitRef` is not null when animation completes

### 7. Multiple cards animation issues

**Symptoms**: Only one card animates or cards overlap incorrectly

**Solutions**:
- Verify `startPositions` array has same length as `cards` array
- Check that each card has unique key: `key={`anim-${index}-${card.type}-${card.number}`}`
- Ensure z-index increases with index: `zIndex: 10000 + index`
- Verify card positions are calculated correctly for each selected card
- Check that `selectedIndices` matches the actual selected cards

### 8. Socket emit timing issues

**Symptoms**: Cards play before animation or animation never completes

**Solutions**:
- Ensure `pendingEmitRef.current` is set before animation starts
- Verify `handleAnimationComplete` is called after animation finishes
- Check that socket emit happens in `handleAnimationComplete`, not `handlePlayCards`
- Add fallback: emit immediately if animation setup fails
- Verify `isAnimating` check prevents multiple simultaneous animations

### 9. Cards appear in center before animation

**Symptoms**: Cards show in center cards area immediately, not after animation

**Solutions**:
- This is expected behavior - cards appear when socket `update` event arrives
- Animation is visual only - actual game state comes from server
- If you want to delay center cards display, add a flag to hide them during animation
- Consider showing a placeholder or keeping previous cards visible during animation

### 10. Performance issues

**Symptoms**: Animation is choppy or causes lag

**Solutions**:
- Use `requestAnimationFrame` (already implemented)
- Reduce number of animated cards if possible
- Simplify transform calculations
- Remove unnecessary re-renders during animation
- Consider using CSS transforms instead of position updates
- Test on lower-end devices and adjust accordingly

