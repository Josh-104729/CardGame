import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import type { RoomInfo } from '../types/api'
import { useAuth } from '../contexts/AuthContext'

interface RoomListProps {
  onJoinRoom?: (roomId: number) => void
}

export default function RoomList({ onJoinRoom }: RoomListProps) {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const response = await apiService.getRooms({
        search_key: searchKey,
        pgSize: pageSize,
        pgNum: currentPage,
      })
      setRooms(response.data || [])
      const totalCount = response.total?.[0]?.total_cnt || 0
      setTotalPages(Math.ceil(totalCount / pageSize) || 1)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchRooms()
  }

  const handleJoinRoom = (room: RoomInfo) => {
    if (onJoinRoom) {
      onJoinRoom(room.room_id)
    }
  }

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return 'Waiting'
      case 1:
        return 'Full'
      case 2:
        return 'Playing'
      case 3:
        return 'Closed'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 0:
        return 'bg-green-500'
      case 1:
        return 'bg-yellow-500'
      case 2:
        return 'bg-blue-500'
      case 3:
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const canJoinRoom = (room: RoomInfo): boolean => {
    if (room.status !== 0) return false
    if (!user) return false
    if (user.bounty < (room.fee || 0)) return false
    if (room.members >= (room.size || 0)) return false
    return true
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by room ID or creator..."
          className="flex-1 px-4 py-2 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Search
        </button>
      </div>

      {/* Room List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-teal-200">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-teal-800/50 rounded-lg p-8 text-center">
          <p className="text-gray-300 text-lg">No rooms found</p>
        </div>
      ) : (
        <>
          <div className="bg-teal-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-teal-600/50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-teal-900/50 border-b border-teal-700 text-sm font-semibold text-teal-200">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Creator</div>
              <div className="col-span-1">Bonus</div>
              <div className="col-span-1">Fee</div>
              <div className="col-span-2">Players</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Action</div>
            </div>

            {/* Room Items */}
            <div className="divide-y divide-teal-700/50">
              {rooms.map((room) => {
                const canJoin = canJoinRoom(room)
                return (
                  <div
                    key={room.room_id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-teal-800/40 transition-colors duration-200 items-center"
                  >
                    <div className="col-span-1 text-white font-medium">#{room.room_id}</div>
                    <div className="col-span-2 text-teal-200">{room.creator}</div>
                    <div className="col-span-1 text-teal-200">{room.bonus || 0}</div>
                    <div className="col-span-1 text-teal-200">{room.fee || 0}</div>
                    <div className="col-span-2 text-teal-200">
                      {room.members} / {room.size || 0}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          room.status
                        )} text-white`}
                      >
                        {getStatusLabel(room.status)}
                      </span>
                    </div>
                    <div className="col-span-3">
                      {room.status === 0 && (
                        <button
                          onClick={() => handleJoinRoom(room)}
                          disabled={!canJoin}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            canJoin
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                          title={
                            !canJoin
                              ? user && user.bounty < (room.fee || 0)
                                ? 'Insufficient bounty'
                                : 'Room is full'
                              : 'Join room'
                          }
                        >
                          Join
                        </button>
                      )}
                      {room.status !== 0 && (
                        <span className="text-gray-400 text-sm">{getStatusLabel(room.status)}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                Previous
              </button>
              <span className="text-teal-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

