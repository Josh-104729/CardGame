import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import GameHeader from '../components/GameHeader'
import GameTable from '../components/GameTable'
import PlayerHand from '../components/PlayerHand'
import GameControls from '../components/GameControls'
import GameStatus from '../components/GameStatus'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { SOCKET_URL } from '../config/api'
import type { RoomInfo } from '../types/api'

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
            
            // Check if current user is still in the room
            const userIndex = param.roomData.userArray.findIndex(
              (u) => u.username === user.username
            )
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

  const users = roomData?.userArray || []
  const roomSize = roomInfo?.size || 4

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Game Area */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-6xl mb-4">
                <GameStatus
                  currentPlayer={users[roomData?.order || 0]?.username || 'Waiting...'}
                  lastPlay="Waiting for game to start"
                  round={1}
                />
              </div>
              <GameTable
                opponents={users.map((user, index) => ({
                  name: user.username,
                  cardCount: roomData?.havingCards[index]?.length || 0,
                  position: index === 0 ? 'top' : index === 1 ? 'left' : 'right',
                  isActive: roomData?.order === index,
                }))}
              />
              {roomData?.isStart && (
                <>
                  <div className="mt-8 w-full max-w-6xl">
                    <PlayerHand />
                  </div>
                  <div className="mt-6">
                    <GameControls />
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

