import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import GameHeader from '../components/GameHeader'
import RoomList from '../components/RoomList'
import CreateRoomModal from '../components/CreateRoomModal'
import ProtectedRoute from '../components/ProtectedRoute'
import { SOCKET_URL } from '../config/api'

export default function LobbyPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  // Set up socket connection to listen for room updates
  useEffect(() => {
    const socket = io(SOCKET_URL)
    socketRef.current = socket

    // Listen for room_refetch events from the server
    socket.on('room_refetch', () => {
      // Trigger room list refresh when a room is created or updated
      setRefreshTrigger((prev) => prev + 1)
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  const handleRoomCreated = () => {
    // Refresh the room list
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Game Lobby</h2>
              <p className="text-teal-200">Browse and join available rooms</p>
            </div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                🏠 Create New Room
              </button>
            </div>
            <RoomList
              onJoinRoom={(roomId) => {
                // Navigate to game page with room ID
                navigate(`/game/${roomId}`)
              }}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
        <CreateRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRoomCreated}
        />
      </div>
    </ProtectedRoute>
  )
}

