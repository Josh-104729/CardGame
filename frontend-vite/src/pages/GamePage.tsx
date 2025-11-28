import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import GameHeader from '../components/GameHeader'
import GameTable from '../components/GameTable'
import PlayerHand from '../components/PlayerHand'
import GameControls from '../components/GameControls'
import GameStatus from '../components/GameStatus'
import CardComponent from '../components/Card'
import ProtectedRoute from '../components/ProtectedRoute'
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
  const [animateCards, setAnimateCards] = useState(false)
  const centerCardsRef = useRef<HTMLDivElement>(null)

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
          console.log('Socket disconnected')
        })
      } catch (err) {
        console.error('Error initializing room:', err)
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

  // Check if cards can be played - MUST be before any conditional returns
  useEffect(() => {
    if (!roomData || !roomData.isStart || myIndex === -1) {
      setCanPlay(false)
      return
    }

    const isMyTurn = roomData.order === myIndex
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
    const lastOrder = roomData.prevOrder
    const previousCards = roomData.droppingCards[lastOrder] || []
    
    if (lastOrder === roomData.order || previousCards.length === 0) {
      // First play or same player's turn
      setCanPlay(selectedCards.length > 0)
    } else {
      // Need to beat previous cards
      const canBeat = cardCompareUtil(previousCards, selectedCards)
      setCanPlay(canBeat)
    }
  }, [selectedCards, roomData, myIndex])

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

  const handleCardSelectionChange = (cards: Card[]) => {
    setSelectedCards(cards)
  }

  const handlePlayCards = () => {
    if (!socketRef.current || !roomId || selectedCards.length === 0 || !canPlay) {
      return
    }

    const validation = guessValidationCheck(selectedCards)
    if (validation.status === 0) {
      setError(validation.msg)
      return
    }

    // Trigger animation
    setAnimateCards(true)

    // Wait for animation to complete before emitting
    setTimeout(() => {
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

      socketRef.current?.emit('shutcards', {
        choosedCard: selectedCards,
        roomId: parseInt(roomId, 10),
        double: double,
        effectOpen: effectOpen,
        effectkind: effectkind,
      })

      setSelectedCards([])
    }, 700) // Wait for animation to complete (600ms + buffer)
  }

  const handleAnimationComplete = () => {
    setAnimateCards(false)
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

  const users = roomData?.userArray || []
  const roomSize = roomInfo?.size || 4
  const isMyTurn = roomData?.isStart && roomData.order === myIndex
  const myCards = myIndex >= 0 && roomData?.havingCards ? roomData.havingCards[myIndex] || [] : []
  const canPass = roomData?.isStart && isMyTurn && roomData.order !== roomData.prevOrder

  // Calculate position using half-ellipse math
  // Uses percentage-based positioning for responsiveness
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
                <div className="mb-4 text-center">
                  <h2 className="text-3xl font-bold text-white">
                    BONUS: {(roomData.bonus || 0) * (roomData.double || 1)}
                  </h2>
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
                <GameTable
                  ref={centerCardsRef}
                  centerCards={
                    roomData?.isStart && roomData.droppingCards[roomData.prevOrder]
                      ? roomData.droppingCards[roomData.prevOrder]
                      : []
                  }
                  opponents={allPlayerSlots.map((slot) => {
                    // Use displayIndex for position calculation (current user at 0 = center/bottom)
                    const calculatedPosition = calculateEllipsePosition(slot.displayIndex, roomSize)
                    
                    if (slot.isEmpty) {
                      // Empty placeholder slot
                      if (calculatedPosition === 'bottom') {
                        return {
                          isEmpty: true,
                          position: 'bottom' as const,
                        }
                      }
                      return {
                        isEmpty: true,
                        customPosition: calculatedPosition,
                      }
                    }
                    
                    // Real player slot
                    const playerUser = slot.user!
                    const originalIndex = slot.originalIndex // Use original index for game logic
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
                      }
                    }
                    
                    return {
                      name: playerUser.username,
                      cardCount: roomData?.havingCards[originalIndex]?.length || 0,
                      customPosition: calculatedPosition,
                      isActive: isActive,
                      progress: progress,
                      isEmpty: false,
                    }
                  })}
                />

                {/* Remaining Cards Display */}
                {roomData?.isStart && roomData.restCardCnt > 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
                    {/* Face-down Card Stack */}
                    <div className="relative">
                      {/* Show a stack of face-down cards */}
                      {Array.from({ length: Math.min(roomData.restCardCnt, 1) }).map((_, index) => (
                        <div
                          key={index}
                          className="absolute"
                          style={{
                            transform: `translate(${index * 3}px, ${index * 3}px)`,
                            zIndex: 10 + index,
                          }}
                        >
                          <CardComponent suit={0} rank={0} isFaceDown={true} />
                        </div>
                      ))}
                      {/* Card Count Number - Centered on the cards */}
                      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                        <span className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.9)] drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]">
                          {roomData.restCardCnt}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {roomData?.isStart && (
                <>
                  <div className="mt-8 w-full max-w-6xl">
                    <PlayerHand
                      cards={myCards}
                      onCardSelectionChange={handleCardSelectionChange}
                      isMyTurn={isMyTurn}
                      animateToCenter={animateCards}
                      onAnimationComplete={handleAnimationComplete}
                      centerTargetRef={centerCardsRef}
                    />
                  </div>
                  <div className="mt-6">
                    <GameControls
                      onPlayCards={handlePlayCards}
                      onPass={handlePass}
                      onExit={handleExit}
                      canPlay={canPlay}
                      canPass={canPass || false}
                      isMyTurn={isMyTurn || false}
                    />
                  </div>
                </>
              )}
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
                      className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                        users.length >= roomSize
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
    </ProtectedRoute>
  )
}

