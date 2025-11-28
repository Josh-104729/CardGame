import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import GameHeader from '../components/GameHeader'
import GameTable from '../components/GameTable'
import PlayerHand, { type PlayerHandRef } from '../components/PlayerHand'
import GameControls from '../components/GameControls'
import GameStatus from '../components/GameStatus'
import CardComponent from '../components/Card'
import OpponentPlayer from '../components/OpponentPlayer'
import ProtectedRoute from '../components/ProtectedRoute'
import CardMoveAnimation from '../components/CardMoveAnimation'
import CardDealAnimation from '../components/CardDealAnimation'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { SOCKET_URL } from '../config/api'
import type { RoomInfo } from '../types/api'
import type { Card } from '../utils/cardValidation'
import { guessValidationCheck } from '../utils/cardValidation'
import { cardCompareUtil } from '../utils/cardCompare'

interface RoomUser {
  username: string
  bounty: number
  exitreq: boolean
  src: string
}

interface RoomData {
  userArray: RoomUser[]
  havingCards: any[][]
  droppingCards: any[][]
  order: number
  cycleCnt: number
  isStart: boolean
  restCardCnt: number
  prevOrder: number
  counterCnt: number
  double: number
  isFinish: boolean
  effectKind: string
  effectOpen: boolean
  host?: string
  fee?: number
  bonus?: number
  size?: number
  isPaused?: boolean
}

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null)
  const [roomData, setRoomData] = useState<RoomData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [canPlay, setCanPlay] = useState(false)
  const [myIndex, setMyIndex] = useState(-1)
  const centerCardsRef = useRef<HTMLDivElement>(null)

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatingCards, setAnimatingCards] = useState<Card[]>([])
  const [cardStartPositions, setCardStartPositions] = useState<Array<{ x: number; y: number }>>([])
  const [cardEndPositions, setCardEndPositions] = useState<Array<{ x: number; y: number }>>([])
  const [excludedCards, setExcludedCards] = useState<Card[]>([])
  const playerHandRef = useRef<PlayerHandRef>(null)
  
  // Card deal animation state
  const [isDealingCards, setIsDealingCards] = useState(false)
  const [dealStartPosition, setDealStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dealEndPositions, setDealEndPositions] = useState<Array<{ x: number; y: number }>>([])
  const [pendingRoomData, setPendingRoomData] = useState<RoomData | null>(null)
  const prevRestCardCntRef = useRef<number>(0)
  const playerPositionRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const roomDataRef = useRef<RoomData | null>(null)
  const pendingEmitRef = useRef<{
    choosedCard: Card[]
    roomId: number
    double: number
    effectOpen: boolean
    effectkind: string
  } | null>(null)

  // Calculate position using half-ellipse math
  // Uses percentage-based positioning for responsiveness
  // This function must be defined before useEffect that uses it
  const calculateEllipsePosition = (userIndex: number, totalSize: number): { x: number; y: number; usePercent: boolean } | 'bottom' => {
    // Current user (index 0) always at bottom center
    if (userIndex === 0) {
      return 'bottom'
    }

    // Use percentage-based calculations (0-100) relative to table container
    const centerX = 50 // 50% of width (center)
    const centerY = 50 // 50% of height (center)

    // Semi-major axis (horizontal): percentage of width available for ellipse
    // Leave ~12% padding on each side for player radius, so a = 38% of width
    const a = 38

    // Semi-minor axis (vertical): percentage of height available for ellipse  
    // Leave ~18% padding from top for player radius, so b = 32% of height
    const b = 32

    // Number of opponents (excluding current user at index 0)
    const opponentCount = totalSize - 1

    // Calculate angle for this opponent
    // Distribute evenly along half-ellipse from left (π) to right (0)
    // We go from π to 0 so leftmost player is at π, rightmost at 0
    const angle = Math.PI * (1 - (userIndex - 1) / (opponentCount - 1 || 1))

    // Ellipse parametric equations for half-ellipse (top half)
    // x = centerX + a * cos(θ) (as percentage)
    // y = centerY - b * sin(θ) (as percentage, negative because y increases downward)
    const xPercent = centerX + a * Math.cos(angle)
    const yPercent = centerY - b * Math.sin(angle)

    return { x: xPercent, y: yPercent, usePercent: true }
  }

  useEffect(() => {
    const initializeRoom = async () => {
      if (!roomId || !user) return

      const roomIdNum = parseInt(roomId, 10)
      if (isNaN(roomIdNum)) {
        setError('Invalid room ID')
        setLoading(false)
        return
      }

      try {
        // Fetch room info
        const room = await apiService.getRoomInfo(roomIdNum)
        if (!room) {
          setError('Room not found')
          setLoading(false)
          return
        }

        setRoomInfo(room)

        // Connect to socket
        const socket = io(SOCKET_URL)
        socketRef.current = socket

        // Join room
        socket.emit('join', {
          user: {
            username: user.username,
            avatarUrl: user.avatar || '',
            bounty: user.bounty,
          },
          room: {
            roomId: roomIdNum,
            bonus: room.bonus || 0,
            fee: room.fee || 0,
            size: room.size || 4,
          },
        })

        // Listen for updates
        socket.on('update', (param: { roomId: number; roomData: RoomData; passBanner?: boolean }) => {
          if (param.roomId === roomIdNum) {
            const prevRestCardCnt = prevRestCardCntRef.current
            const currentRestCardCnt = param.roomData.restCardCnt || 0
            
            // Detect if cards are being dealt (restCardCnt decreased)
            // This should work for ALL clients, not just the creator
            // All clients receive the same update event when cards are dealt
            // IMPORTANT: Check BEFORE updating the ref, so we use the previous value
            // Initialize prevRestCardCnt if not set (for clients joining mid-game)
            if (prevRestCardCnt === 0 && currentRestCardCnt > 0) {
              // First time seeing restCardCnt - initialize it
              prevRestCardCntRef.current = currentRestCardCnt
            }
            
            // Now check if cards are being dealt (restCardCnt decreased)
            const cardsDealt = prevRestCardCnt > 0 && prevRestCardCnt > currentRestCardCnt && param.roomData.isStart && currentRestCardCnt >= 0
            
            if (cardsDealt && centerCardsRef.current) {
              
              // Store the new room data to apply after animation
              setPendingRoomData(param.roomData)
              
              // Get position from RIGHT side of remaining cards stack
              // Cards are stacked with ml-[-70px], creating overlapping effect
              // The first card (index 0) is at center, subsequent cards shift left by 70px each
              // The rightmost visible edge is from the first card at center position
              const centerRect = centerCardsRef.current.getBoundingClientRect()
              const cardWidth = 80 // w-20 = 80px
              // Rightmost card is the first one (index 0) at center, right edge is center + cardWidth/2
              const startX = centerRect.left + centerRect.width / 2 + (cardWidth / 2)
              const startY = centerRect.top + centerRect.height / 2
              
              setDealStartPosition({ x: startX, y: startY })
              
              // Calculate end positions for each player using calculatedPosition
              // We need to get the GameTable container to convert percentage positions to pixels
              const collectPositions = () => {
                const endPositions: Array<{ x: number; y: number }> = []
                const roomSize = param.roomData.size || 4
                
                // Get the GameTable container to convert percentage positions to pixels
                const gameTableContainer = centerCardsRef.current?.parentElement?.parentElement
                if (!gameTableContainer) {
                  // Fallback: retry after a short delay
                  setTimeout(() => collectPositions(), 100)
                  return
                }
                
                const containerRect = gameTableContainer.getBoundingClientRect()
                
                // Find current user's index in the original users array for this roomData
                const currentUserIndexForDeal = param.roomData.userArray.findIndex(
                  (u) => u.username === user?.username
                )
                
                // Rotate users array so current user is at index 0 (for display purposes)
                const rotateUsersArray = <T,>(arr: T[], startIndex: number): T[] => {
                  if (startIndex <= 0 || startIndex >= arr.length) return arr
                  return [...arr.slice(startIndex), ...arr.slice(0, startIndex)]
                }
                
                const rotatedUsersForDeal = rotateUsersArray(
                  param.roomData.userArray,
                  currentUserIndexForDeal >= 0 ? currentUserIndexForDeal : 0
                )
                
                // Map rotated users back to their original indices
                const getOriginalIndexForDeal = (rotatedIndex: number): number => {
                  if (currentUserIndexForDeal < 0) return rotatedIndex
                  return (currentUserIndexForDeal + rotatedIndex) % param.roomData.userArray.length
                }
                
                // Create all player slots (rotated so current user is at displayIndex 0)
                const allPlayerSlotsForDeal = rotatedUsersForDeal.map((playerUser, rotatedIndex) => ({
                  user: playerUser,
                  displayIndex: rotatedIndex,
                  originalIndex: getOriginalIndexForDeal(rotatedIndex),
                  isEmpty: false,
                }))
                
                // Now collect positions in the order of userArray indices (0, 1, 2, 3...)
                for (let i = 0; i < roomSize; i++) {
                  // Find the slot that corresponds to userArray[i]
                  const slot = allPlayerSlotsForDeal.find(s => s.originalIndex === i)
                  
                  if (slot) {
                    // Calculate position using the same logic as when rendering
                    const calculatedPosition = calculateEllipsePosition(slot.displayIndex, roomSize)
                    
                    let position: { x: number; y: number }
                    
                    if (calculatedPosition === 'bottom') {
                      // Current user at bottom - get position from DOM ref
                      const playerElement = playerPositionRefs.current.get(i)
                      if (playerElement) {
                        playerElement.offsetHeight
                        const rect = playerElement.getBoundingClientRect()
                        position = {
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                        }
                      } else {
                        // Fallback: calculate bottom center position
                        position = {
                          x: containerRect.left + containerRect.width / 2,
                          y: containerRect.bottom - 80, // Approximate bottom position
                        }
                      }
                    } else if (typeof calculatedPosition === 'object' && calculatedPosition.usePercent) {
                      // Convert percentage to pixels
                      position = {
                        x: containerRect.left + (containerRect.width * calculatedPosition.x / 100),
                        y: containerRect.top + (containerRect.height * calculatedPosition.y / 100),
                      }
                    } else {
                      // Fallback position
                      position = { x: 0, y: 0 }
                    }
                    
                    endPositions.push(position)
                  } else {
                    // Fallback position if slot not found
                    endPositions.push({ x: 0, y: 0 })
                  }
                }
                
                // Check if we have valid positions for all players
                const validPositions = endPositions.filter(pos => pos.x !== 0 || pos.y !== 0)
                
                // Log CardDealAnimation positions: From {position} To {Position} - Player {No}
                // Log even if not all positions are valid, so we can see what's happening
                if (endPositions.length > 0) {
                  endPositions.forEach((endPos, idx) => {
                    const playerName = param.roomData.userArray[idx]?.username || `Player ${idx}`
                    console.log(`From {x: ${Math.round(startX)}, y: ${Math.round(startY)}} To {x: ${Math.round(endPos.x)}, y: ${Math.round(endPos.y)}} - Player ${playerName}`)
                  })
                }
                
                if (endPositions.length === roomSize && validPositions.length === roomSize) {
                  // All positions found, start animation
                  setDealEndPositions(endPositions)
                  setIsDealingCards(true)
                } else {
                  // Retry after a short delay if positions not ready
                  setTimeout(() => {
                    collectPositions()
                  }, 100)
                }
              }
              
              // Start collecting positions after a short delay to ensure DOM is ready
              setTimeout(() => {
                requestAnimationFrame(() => {
                  collectPositions()
                })
              }, 100)
              
              // Update prevRestCardCnt AFTER triggering animation
              // This ensures the next deal can be detected
              prevRestCardCntRef.current = currentRestCardCnt
            } else {
              // Normal update (no card dealing)
              // Update prevRestCardCnt for tracking
              if (prevRestCardCnt === 0 && currentRestCardCnt > 0) {
                // Initialize on first update
                prevRestCardCntRef.current = currentRestCardCnt
              } else if (prevRestCardCnt !== currentRestCardCnt) {
                // Update when restCardCnt changes (but not a deal)
                prevRestCardCntRef.current = currentRestCardCnt
              }
              
              setRoomData(param.roomData)
              setLoading(false)
              setError('')

              // Find current user's index
              const userIndex = param.roomData.userArray.findIndex(
                (u) => u.username === user.username
              )
              setMyIndex(userIndex)

              // Clear selection when counter resets
              if (param.roomData.counterCnt === 0) {
                setSelectedCards([])
              }

              // Check if current user is still in the room
              if (userIndex === -1 && param.roomData.isStart) {
                // User was removed from the room
                setError('You were removed from the room')
                setTimeout(() => {
                  navigate('/lobby')
                }, 2000)
              }
            }
            // Note: prevRestCardCntRef is updated in the cardsDealt branch (line 323) 
            // and in the else branch (lines 327-333), so no need to update here
          }
        })

        // Listen for room full
        socket.on('full', (param: { msg: string; variant: string }) => {
          setError(param.msg)
          setTimeout(() => {
            navigate('/lobby')
          }, 2000)
        })

        // Listen for exit
        socket.on('exit', (param: { roomId: number; host: boolean }) => {
          if (param.roomId === roomIdNum) {
            if (param.host) {
              setError('Room was closed by host')
            }
            setTimeout(() => {
              navigate('/lobby')
            }, 2000)
          }
        })

                // Handle disconnect
                socket.on('disconnect', () => {
                  // Socket disconnected
                })
              } catch (err) {
                setError('Failed to join room')
                setLoading(false)
              }
    }

    initializeRoom()

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [roomId, user, navigate])

  // Keep roomDataRef in sync with roomData
  useEffect(() => {
    roomDataRef.current = roomData
  }, [roomData])

  // Create a stable key for game state to avoid infinite loops from object reference changes
  const gameStateKey = useMemo(() => {
    if (!roomData || !roomData.isStart) {
      return JSON.stringify({ isStart: false, order: -1, prevOrder: -1, previousCards: [] })
    }
    const lastOrder = roomData.prevOrder
    const previousCards = roomData.droppingCards[lastOrder] || []
    return JSON.stringify({
      isStart: roomData.isStart,
      order: roomData.order,
      prevOrder: roomData.prevOrder,
      previousCards,
    })
  }, [roomData?.isStart, roomData?.order, roomData?.prevOrder, roomData?.droppingCards])

  // Check if cards can be played - MUST be before any conditional returns
  useEffect(() => {
    const currentRoomData = roomDataRef.current
    if (!currentRoomData || !currentRoomData.isStart || myIndex === -1) {
      setCanPlay(false)
      return
    }

    const isMyTurn = currentRoomData.order === myIndex
    if (!isMyTurn) {
      setCanPlay(false)
      return
    }

    if (selectedCards.length === 0) {
      setCanPlay(false)
      return
    }

    // Validate card selection
    const validation = guessValidationCheck(selectedCards)
    if (validation.status === 0) {
      setCanPlay(false)
      return
    }

    // Check if cards can beat previous cards
    const lastOrder = currentRoomData.prevOrder
    const previousCards = currentRoomData.droppingCards[lastOrder] || []

    if (lastOrder === currentRoomData.order || previousCards.length === 0) {
      // First play or same player's turn
      setCanPlay(selectedCards.length > 0)
    } else {
      // Need to beat previous cards
      const canBeat = cardCompareUtil(previousCards, selectedCards)
      setCanPlay(canBeat)
    }
  }, [selectedCards, gameStateKey, myIndex])

  // Animation complete handler - use ref to avoid stale closures
  // MUST be declared before any early returns to maintain hook order
  const handleAnimationCompleteRef = useRef<() => void>(() => { })

  useEffect(() => {
    handleAnimationCompleteRef.current = () => {
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
        setCardEndPositions([])
      }, 100)
    }
  }, [])

  const handleAnimationComplete = () => {
    handleAnimationCompleteRef.current()
  }

  // Card deal animation complete handler
  const handleDealAnimationComplete = () => {
    setIsDealingCards(false)
    
    // Apply pending room data after animation completes
    if (pendingRoomData) {
      setRoomData(pendingRoomData)
      setLoading(false)
      setError('')
      
      const userIndex = pendingRoomData.userArray.findIndex(
        (u) => u.username === user?.username
      )
      setMyIndex(userIndex)
      
      // Clear selection when counter resets
      if (pendingRoomData.counterCnt === 0) {
        setSelectedCards([])
      }
      
      // Update previous restCardCnt after applying new data
      prevRestCardCntRef.current = pendingRoomData.restCardCnt || 0
      
      setPendingRoomData(null)
    }
    
    // Clear animation state
    setTimeout(() => {
      setDealStartPosition({ x: 0, y: 0 })
      setDealEndPositions([])
    }, 100)
  }

  // MUST be before early returns to maintain hook order
  const handleCardSelectionChange = useCallback((cards: Card[]) => {
    setSelectedCards(cards)
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <GameHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-teal-200 text-lg">Joining room...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <GameHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-900/50 border-2 border-red-600/50 rounded-xl p-8 text-center max-w-md">
              <p className="text-red-200 text-lg font-semibold mb-4">{error}</p>
              <button
                onClick={() => navigate('/lobby')}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const handlePlayCards = () => {
    if (!socketRef.current || !roomId || selectedCards.length === 0 || !canPlay || isAnimating || roomData?.isPaused) {
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

    // Check for special effects
    if (validation.status === 3) {
      // Madae
      double *= 2
      effectOpen = true
      effectkind = 'madae'
    } else if (validation.status === 4) {
      // Taso
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

    // Get card positions for animation
    if (playerHandRef.current && centerCardsRef.current && selectedCards.length > 0) {
      const myCards = myIndex >= 0 && roomData?.havingCards ? roomData.havingCards[myIndex] || [] : []

      // Find indices of selected cards - handle duplicates correctly
      const selectedIndices: number[] = []
      const usedIndices = new Set<number>() // Track which indices we've already used

      selectedCards.forEach((selectedCard) => {
        // Find all matching cards, but skip ones we've already used
        for (let i = 0; i < myCards.length; i++) {
          if (!usedIndices.has(i)) {
            const card = myCards[i]
            if (card && card.type === selectedCard.type && card.number === selectedCard.number) {
              selectedIndices.push(i)
              usedIndices.add(i)
              break // Found a match, move to next selected card
            }
          }
        }
      })

      // Validate we found all selected cards
      if (selectedIndices.length === selectedCards.length && selectedIndices.length > 0) {
        // Use requestAnimationFrame to ensure DOM is ready before getting positions
        requestAnimationFrame(() => {
          // Double-check refs are still valid
          if (!playerHandRef.current || !centerCardsRef.current) {
            // Fallback: emit immediately
            if (pendingEmitRef.current && socketRef.current) {
              socketRef.current.emit('shutcards', pendingEmitRef.current)
              pendingEmitRef.current = null
            }
            return
          }

          // Get start positions
          const startPositions = playerHandRef.current.getSelectedCardPositions(selectedIndices)

                  // Validate positions - check that we have valid positions for all cards
                  if (startPositions.length !== selectedCards.length) {
            // Fallback: emit immediately
            if (pendingEmitRef.current && socketRef.current) {
              socketRef.current.emit('shutcards', pendingEmitRef.current)
              pendingEmitRef.current = null
            }
            return
          }

                  // Check for invalid positions (all zeros might indicate element not found)
                  const invalidPositions = startPositions.filter(pos => 
                    (pos.x === 0 && pos.y === 0) || 
                    (pos.x === window.innerWidth / 2 && pos.y === window.innerHeight / 2)
                  )
                  
                  if (invalidPositions.length > 0 && invalidPositions.length === startPositions.length) {
            // Fallback: emit immediately
            if (pendingEmitRef.current && socketRef.current) {
              socketRef.current.emit('shutcards', pendingEmitRef.current)
              pendingEmitRef.current = null
            }
            return
          }

          // Calculate end positions for each card
          // Cards are displayed with flex gap-4 (16px gap) and each card is w-20 (80px wide)
          const centerRect = centerCardsRef.current.getBoundingClientRect()
          const centerX = centerRect.left + centerRect.width / 2
          const centerY = centerRect.top + centerRect.height / 2

          const cardWidth = 80 // w-20 = 5rem = 80px
          const cardGap = 16 // gap-4 = 1rem = 16px
          const totalWidth = selectedCards.length * cardWidth + (selectedCards.length - 1) * cardGap
          const startX = centerX - totalWidth / 2 + cardWidth / 2 // First card center position

          // Calculate individual end positions for each card
          const endPositions = selectedCards.map((_, index) => {
            const cardX = startX + index * (cardWidth + cardGap)
            return {
              x: cardX,
              y: centerY,
            }
          })

          setCardStartPositions(startPositions)
          setCardEndPositions(endPositions)
          setAnimatingCards([...selectedCards])
          setExcludedCards([...selectedCards])
          setIsAnimating(true)
          setSelectedCards([]) // Clear selection immediately
        })
        return // Exit early, animation will trigger emit
      }
    }

    // Fallback: emit immediately if animation setup fails
    if (pendingEmitRef.current && socketRef.current) {
      socketRef.current.emit('shutcards', pendingEmitRef.current)
      pendingEmitRef.current = null
      setSelectedCards([])
    }
  }


  const handlePass = () => {
    if (!socketRef.current || !roomId) return
    socketRef.current.emit('passcards', {
      roomId: parseInt(roomId, 10),
    })
    setSelectedCards([])
  }

  const handleExit = () => {
    if (!socketRef.current || !roomId) return
    socketRef.current.emit('exit', {
      roomId: parseInt(roomId, 10),
    })
  }

  const handlePause = () => {
    if (!socketRef.current || !roomId) return
    socketRef.current.emit('pausegame', {
      roomId: parseInt(roomId, 10),
    })
  }

  const users = roomData?.userArray || []
  const roomSize = roomInfo?.size || 4
  const isMyTurn = roomData?.isStart && roomData.order === myIndex
  const myCards = myIndex >= 0 && roomData?.havingCards ? roomData.havingCards[myIndex] || [] : []
  const canPass = roomData?.isStart && isMyTurn && roomData.order !== roomData.prevOrder

  // Find current user's index in the original users array
  const currentUserIndex = myIndex >= 0 ? myIndex : users.findIndex((u) => u.username === user?.username)

  // Rotate players array so current user is at index 0 (center/bottom position)
  // This ensures current user is always displayed at the center
  const rotatePlayersArray = <T,>(arr: T[], startIndex: number): T[] => {
    if (startIndex <= 0 || startIndex >= arr.length) return arr
    return [...arr.slice(startIndex), ...arr.slice(0, startIndex)]
  }

  const rotatedUsers = rotatePlayersArray(users, currentUserIndex >= 0 ? currentUserIndex : 0)

  // Map rotated users back to their original indices for game logic
  const getOriginalIndex = (rotatedIndex: number): number => {
    if (currentUserIndex < 0) return rotatedIndex
    return (currentUserIndex + rotatedIndex) % users.length
  }

  // Only show empty slots if game hasn't started yet
  const emptySlotsCount = roomData?.isStart ? 0 : Math.max(0, roomSize - users.length)

  // Create array of all player slots (real players + empty placeholders)
  // Rotated so current user is at display index 0 (center/bottom)
  const allPlayerSlots = [
    ...rotatedUsers.map((playerUser, rotatedIndex) => ({
      user: playerUser,
      displayIndex: rotatedIndex, // Position in display (0 = center/bottom)
      originalIndex: getOriginalIndex(rotatedIndex), // Original index for game logic
      isEmpty: false,
    })),
    ...Array.from({ length: emptySlotsCount }, (_, i) => ({
      user: null,
      displayIndex: rotatedUsers.length + i,
      originalIndex: users.length + i, // Empty slots use original indices beyond current users
      isEmpty: true,
    })),
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Game Area */}
            <div className="flex flex-col items-center">
              {/* Bonus Display */}
              {roomData && (
                <div className="h-12 mb-4 text-center flex justify-center gap-4">
                  <h2 className="text-3xl font-bold text-white">
                    BONUS: {(roomData.bonus || 0) * (roomData.double || 1)}
                  </h2>
                  {roomData?.isPaused && (
                    <div className="mb-2 text-center">
                      <div className="inline-block px-6 py-2 bg-orange-600/80 border-2 border-orange-400 rounded-lg">
                        <p className="text-white font-bold text-lg">⏸️ GAME PAUSED</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full max-w-6xl mb-4">

                <GameStatus
                  currentPlayer={users[roomData?.order || 0]?.username || 'Waiting...'}
                  lastPlay={
                    roomData?.isStart && roomData.droppingCards[roomData.prevOrder]?.length > 0
                      ? `${roomData.droppingCards[roomData.prevOrder].length} cards`
                      : 'Waiting for game to start'
                  }
                  round={roomData?.cycleCnt || 0}
                />
              </div>

              <div className="relative w-full max-w-6xl">
                {/* Pause Button - Top Right */}
                {roomData?.isStart && roomData?.host === user?.username && (
                  <div className="absolute top-4 right-4 z-50">
                    <button
                      onClick={handlePause}
                      className={`px-4 py-2 font-semibold rounded-lg shadow-lg transition-all duration-200 ${roomData?.isPaused
                          ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white hover:scale-105'
                          : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white hover:scale-105'
                        }`}
                    >
                      {roomData?.isPaused ? '▶️ Resume' : '⏸️ Pause'}
                    </button>
                  </div>
                )}

                <GameTable
                  ref={centerCardsRef}
                  centerCards={
                    roomData?.isStart && roomData.droppingCards[roomData.prevOrder]
                      ? roomData.droppingCards[roomData.prevOrder]
                      : []
                  }
                  onOpponentRef={(index, element) => {
                    if (element) {
                      // Store the ref with the originalIndex
                      playerPositionRefs.current.set(index, element)
                      // Also ensure the data attribute is set for username matching
                      if (element && !element.getAttribute('data-player-name')) {
                        // Find the username from roomData
                        const player = roomData?.userArray[index]
                        if (player) {
                          element.setAttribute('data-player-name', player.username)
                        }
                      }
                    } else {
                      playerPositionRefs.current.delete(index)
                    }
                  }}
                  playerHand={
                    roomData?.isStart ? (
                      <PlayerHand
                        ref={playerHandRef}
                        cards={myCards}
                        onCardSelectionChange={handleCardSelectionChange}
                        isMyTurn={isMyTurn && !roomData?.isPaused}
                        excludeCards={excludedCards}
                      />
                    ) : undefined
                  }
                  gameControls={
                    roomData?.isStart ? (
                      <GameControls
                        onPlayCards={handlePlayCards}
                        onPass={handlePass}
                        onExit={handleExit}
                        canPlay={canPlay && !roomData?.isPaused}
                        canPass={(canPass || false) && !roomData?.isPaused}
                        isMyTurn={isMyTurn || false}
                      />
                    ) : undefined
                  }
                  currentUserPlayer={
                    (() => {
                      // Find current user slot (displayIndex 0)
                      const currentUserSlot = allPlayerSlots.find(slot => slot.displayIndex === 0 && !slot.isEmpty)
                      if (!currentUserSlot || !currentUserSlot.user) return undefined

                      const playerUser = currentUserSlot.user
                      const originalIndex = currentUserSlot.originalIndex
                      const isActive = roomData?.order === originalIndex
                      const progress = isActive && roomData?.counterCnt !== undefined
                        ? Math.min(roomData.counterCnt / 10, 1)
                        : 0

                      return (
                        <div
                          ref={(el) => {
                            if (el) {
                              playerPositionRefs.current.set(originalIndex, el)
                            } else {
                              playerPositionRefs.current.delete(originalIndex)
                            }
                          }}
                        >
                          <OpponentPlayer
                            name={playerUser.username}
                            cardCount={roomData?.havingCards[originalIndex]?.length || 0}
                            position="bottom"
                            isActive={isActive}
                            progress={progress}
                            isEmpty={false}
                            inline={true}
                          />
                        </div>
                      )
                    })()
                  }
                  opponents={allPlayerSlots
                    .filter((slot) => {
                      // Filter out current user (displayIndex 0) from opponents
                      return slot.displayIndex !== 0
                    })
                    .map((slot) => {
                      // Store ref for player position tracking
                      const originalIndex = slot.originalIndex
                      // Use displayIndex for position calculation
                      const calculatedPosition = calculateEllipsePosition(slot.displayIndex, roomSize)

                      if (slot.isEmpty) {
                        // Empty placeholder slot
                        if (calculatedPosition === 'bottom') {
                          return {
                            isEmpty: true,
                            position: 'bottom' as const,
                            customPosition: undefined,
                          }
                        }
                        if (typeof calculatedPosition === 'object') {
                          return {
                            isEmpty: true,
                            customPosition: calculatedPosition,
                            position: undefined,
                          }
                        }
                        return {
                          isEmpty: true,
                          position: calculatedPosition,
                          customPosition: undefined,
                        }
                      }

                      // Real player slot
                      const playerUser = slot.user!
                      const isActive = roomData?.order === originalIndex
                      // Calculate progress: counterCnt goes from 0 to 10 (10 seconds timer)
                      const progress = isActive && roomData?.counterCnt !== undefined
                        ? Math.min(roomData.counterCnt / 10, 1)
                        : 0

                      if (calculatedPosition === 'bottom') {
                        return {
                          name: playerUser.username,
                          cardCount: roomData?.havingCards[originalIndex]?.length || 0,
                          position: 'bottom' as const,
                          isActive: isActive,
                          progress: progress,
                          isEmpty: false,
                          customPosition: undefined,
                          originalIndex: originalIndex, // Add originalIndex for ref tracking
                        }
                      }
                      
                      if (typeof calculatedPosition === 'object') {
                        return {
                          name: playerUser.username,
                          cardCount: roomData?.havingCards[originalIndex]?.length || 0,
                          customPosition: calculatedPosition,
                          isActive: isActive,
                          progress: progress,
                          isEmpty: false,
                          position: undefined,
                          originalIndex: originalIndex, // Add originalIndex for ref tracking
                        }
                      }
                      
                      return {
                        name: playerUser.username,
                        cardCount: roomData?.havingCards[originalIndex]?.length || 0,
                        position: calculatedPosition,
                        isActive: isActive,
                        progress: progress,
                        isEmpty: false,
                        customPosition: undefined,
                        originalIndex: originalIndex, // Add originalIndex for ref tracking
                      }
                    })}
                />

                {/* Remaining Cards Display */}
                {roomData?.isStart && roomData.restCardCnt > 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
                    {/* Face-down Card Stack */}
                    <div className="relative">
                      {/* Show a stack of face-down cards */}
                      <div className="flex items-center justify-center opacity-50 card-shadow">
                        {Array.from({ length: Math.min(roomData.restCardCnt, roomData.restCardCnt) }).map((_, index) => (
                          <div
                            key={index}
                            className="ml-[-70px]"
                          >
                            <CardComponent suit={0} rank={0} isFaceDown={true} />
                          </div>
                        ))}
                      </div>
                      {/* Card Count Number - Centered on the cards */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 20 }}>
                        <span className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.9)] drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]">
                          {roomData.restCardCnt}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!roomData?.isStart && (
                <div className="mt-8 text-center">
                  <p className="text-teal-200 text-lg mb-4">
                    Waiting for {roomSize - users.length} more player{roomSize - users.length !== 1 ? 's' : ''} to join...
                  </p>
                  {users.length > 0 && users[0].username === user?.username && (
                    <button
                      onClick={() => {
                        if (socketRef.current && roomId) {
                          socketRef.current.emit('startgame', { roomId: parseInt(roomId, 10) })
                        }
                      }}
                      disabled={users.length < roomSize}
                      className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 ${users.length >= roomSize
                        ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Start Game
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CardMoveAnimation
        cards={animatingCards}
        startPositions={cardStartPositions}
        endPositions={cardEndPositions}
        onAnimationComplete={handleAnimationComplete}
        isAnimating={isAnimating}
      />
      <CardDealAnimation
        cardCount={pendingRoomData?.size || roomData?.size || dealEndPositions.length}
        startPosition={dealStartPosition}
        endPositions={dealEndPositions}
        onAnimationComplete={handleDealAnimationComplete}
        isAnimating={isDealingCards}
      />
    </ProtectedRoute>
  )
}

