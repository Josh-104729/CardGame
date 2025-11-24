import { useState, useEffect, useMemo } from 'react'
import { apiService } from '../services/api'
import type { RoomInfo } from '../types/api'
import { useAuth } from '../contexts/AuthContext'

interface RoomListProps {
  onJoinRoom?: (roomId: number) => void
  refreshTrigger?: number
}

export default function RoomList({ onJoinRoom, refreshTrigger }: RoomListProps) {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 12

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const response = await apiService.getRooms({
        search_key: searchKey,
        pgSize: pageSize,
        pgNum: currentPage,
      })
      setRooms(response.data || [])
      const count = response.total?.[0]?.total_cnt || 0
      setTotalCount(count)
      setTotalPages(Math.ceil(count / pageSize) || 1)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [currentPage, refreshTrigger])

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
        return 'bg-gradient-to-r from-green-500 to-emerald-600'
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-amber-600'
      case 2:
        return 'bg-gradient-to-r from-blue-500 to-cyan-600'
      case 3:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: number): string => {
    switch (status) {
      case 0:
        return '⏳'
      case 1:
        return '🔒'
      case 2:
        return '🎮'
      case 3:
        return '❌'
      default:
        return '❓'
    }
  }

  const canJoinRoom = (room: RoomInfo): boolean => {
    if (room.status !== 0) return false
    if (!user) return false
    if (user.bounty < (room.fee || 0)) return false
    if (room.members >= (room.size || 0)) return false
    return true
  }

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Enhanced Search Bar */}
      <div className="mb-8">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="🔍 Search by room ID or creator name..."
              className="w-full px-5 py-3 bg-gradient-to-r from-teal-900/60 to-teal-800/60 border-2 border-teal-600/50 rounded-xl text-white placeholder-teal-300/70 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 shadow-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
          >
            Search
          </button>
        </div>
        {totalCount > 0 && (
          <p className="mt-3 text-teal-300/80 text-sm">
            Found {totalCount} room{totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Room Cards Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-teal-200 text-lg font-semibold">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-gradient-to-br from-teal-900/50 to-teal-800/50 rounded-2xl p-12 text-center border-2 border-teal-600/30 shadow-xl">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-300 text-xl font-semibold mb-2">No rooms found</p>
          <p className="text-teal-300/70">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {rooms.map((room) => {
              const canJoin = canJoinRoom(room)
              const playerPercentage = ((room.members / (room.size || 1)) * 100).toFixed(0)
              
              return (
                <div
                  key={room.room_id}
                  className={`group relative bg-gradient-to-br from-teal-900/60 to-teal-800/60 rounded-2xl p-6 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    room.status === 0
                      ? 'border-teal-500/50 hover:border-teal-400 shadow-lg hover:shadow-teal-500/30'
                      : 'border-teal-700/50 shadow-md'
                  }`}
                >
                  {/* Room ID Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    #{room.room_id}
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getStatusColor(
                        room.status
                      )}`}
                    >
                      <span>{getStatusIcon(room.status)}</span>
                      {getStatusLabel(room.status)}
                    </span>
                  </div>

                  {/* Creator Info */}
                  <div className="mb-4">
                    <p className="text-teal-300/70 text-sm mb-1">Created by</p>
                    <p className="text-white font-bold text-lg">{room.creator}</p>
                  </div>

                  {/* Room Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-teal-800/40 rounded-xl p-3 border border-teal-600/30">
                      <p className="text-teal-300/70 text-xs mb-1">💰 Entry Fee</p>
                      <p className="text-white font-bold text-xl">{room.fee || 0}</p>
                    </div>
                    <div className="bg-teal-800/40 rounded-xl p-3 border border-teal-600/30">
                      <p className="text-teal-300/70 text-xs mb-1">🎁 Bonus</p>
                      <p className="text-white font-bold text-xl">{room.bonus || 0}</p>
                    </div>
                  </div>

                  {/* Players Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-teal-300/70 text-sm">Players</p>
                      <p className="text-white font-semibold">
                        {room.members} / {room.size || 0}
                      </p>
                    </div>
                    <div className="w-full bg-teal-900/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          room.status === 0
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}
                        style={{ width: `${Math.min(100, parseInt(playerPercentage))}%` }}
                      />
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => handleJoinRoom(room)}
                    disabled={!canJoin || room.status !== 0}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
                      canJoin && room.status === 0
                        ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 hover:scale-105 shadow-lg hover:shadow-green-500/50'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      !canJoin
                        ? user && user.bounty < (room.fee || 0)
                          ? 'Insufficient bounty'
                          : 'Room is full'
                        : 'Join room'
                    }
                  >
                    {room.status === 0 && canJoin ? (
                      <span className="flex items-center justify-center gap-2">
                        <span>🚪</span>
                        <span>Join Room</span>
                      </span>
                    ) : room.status === 0 ? (
                      <span className="flex items-center justify-center gap-2">
                        <span>🔒</span>
                        <span>Cannot Join</span>
                      </span>
                    ) : (
                      <span>{getStatusLabel(room.status)}</span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  ««
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  ‹ Previous
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-teal-300 font-semibold"
                      >
                        ...
                      </span>
                    )
                  }

                  const pageNum = page as number
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[44px] px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-110'
                          : 'bg-teal-800/50 hover:bg-teal-700/70 text-teal-200 hover:text-white hover:scale-105 shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  Next ›
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  »»
                </button>
              </div>

              {/* Page Info */}
              <div className="text-center">
                <p className="text-teal-300/80 text-sm">
                  Showing page <span className="font-bold text-white">{currentPage}</span> of{' '}
                  <span className="font-bold text-white">{totalPages}</span>
                  {totalCount > 0 && (
                    <>
                      {' '}
                      ({totalCount} room{totalCount !== 1 ? 's' : ''} total)
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

