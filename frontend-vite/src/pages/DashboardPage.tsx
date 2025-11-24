import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GameHeader from '../components/GameHeader'
import ProtectedRoute from '../components/ProtectedRoute'
import { apiService } from '../services/api'
import type { RoomInfo } from '../types/api'

interface TopPlayer {
  username: string
  wins: number
  bounty: number
  rank: number
}

interface ShopItem {
  id: number
  name: string
  description: string
  price: number
  icon: string
  category: 'bounty' | 'avatar' | 'theme' | 'powerup'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [popularRooms, setPopularRooms] = useState<RoomInfo[]>([])
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([])
  const [featuredShopItems, setFeaturedShopItems] = useState<ShopItem[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch popular rooms
        const roomsResponse = await apiService.getRooms({
          search_key: '',
          pgSize: 6,
          pgNum: 1,
        })
        const activeRooms = (roomsResponse.data || []).filter(room => room.status === 0)
        setPopularRooms(activeRooms.slice(0, 6))

        // Fetch top players (mock data for now)
        const mockTopPlayers: TopPlayer[] = [
          { username: 'CardMaster', wins: 125, bounty: 5000, rank: 1 },
          { username: 'AcePlayer', wins: 98, bounty: 4200, rank: 2 },
          { username: 'LuckyWinner', wins: 87, bounty: 3800, rank: 3 },
          { username: 'GameChanger', wins: 76, bounty: 3500, rank: 4 },
          { username: 'ProGamer', wins: 65, bounty: 3200, rank: 5 },
        ]
        setTopPlayers(mockTopPlayers)

        // Find user's rank (mock for now)
        const userRankIndex = mockTopPlayers.findIndex(p => p.username === user?.username)
        setUserRank(userRankIndex >= 0 ? userRankIndex + 1 : null)

        // Featured shop items
        const featuredItems: ShopItem[] = [
          { id: 1, name: 'Starter Pack', description: '100 Bounty Points', price: 4.99, icon: '💰', category: 'bounty' },
          { id: 2, name: 'Premium Pack', description: '500 Bounty Points', price: 19.99, icon: '💎', category: 'bounty' },
          { id: 5, name: 'Golden Avatar', description: 'Exclusive golden frame', price: 99, icon: '👑', category: 'avatar' },
          { id: 11, name: 'Lucky Charm', description: 'Increase win chance by 10%', price: 79, icon: '🍀', category: 'powerup' },
        ]
        setFeaturedShopItems(featuredItems)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const getStatusBadge = (status: number) => {
    const badges = {
      0: { text: 'Waiting', color: 'bg-green-500' },
      1: { text: 'Full', color: 'bg-yellow-500' },
      2: { text: 'Playing', color: 'bg-blue-500' },
      3: { text: 'Closed', color: 'bg-gray-500' },
    }
    const badge = badges[status as keyof typeof badges] || badges[3]
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.color} text-white`}>
        {badge.text}
      </span>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Welcome back, {user?.username}! 🎮
                </span>
              </h1>
              <p className="text-xl text-teal-200">Ready to play some amazing card games?</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-teal-800/50 to-teal-900/50 backdrop-blur-sm rounded-xl p-6 border-2 border-teal-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💰</div>
                  <div className="text-3xl font-bold text-yellow-300">{user?.bounty || 0}</div>
                </div>
                <h3 className="text-lg font-semibold text-teal-200 mb-1">Your Bounty</h3>
                <p className="text-sm text-teal-300">Available credits to play</p>
              </div>

              <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🎯</div>
                  <div className="text-3xl font-bold text-pink-300">{popularRooms.length}</div>
                </div>
                <h3 className="text-lg font-semibold text-purple-200 mb-1">Active Rooms</h3>
                <p className="text-sm text-purple-300">Rooms waiting for players</p>
              </div>

              <div className="bg-gradient-to-br from-amber-800/50 to-amber-900/50 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🏆</div>
                  <div className="text-3xl font-bold text-yellow-300">0</div>
                </div>
                <h3 className="text-lg font-semibold text-amber-200 mb-1">Wins</h3>
                <p className="text-sm text-amber-300">Your total victories</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                  onClick={() => navigate('/lobby')}
                  className="group relative bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-xl p-6 text-left shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">🎮</div>
                    <h3 className="text-xl font-bold text-white mb-1">Browse Rooms</h3>
                    <p className="text-teal-100 text-sm">Find and join available game rooms</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/create-room')}
                  className="group relative bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl p-6 text-left shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 group-hover:animate-spin">🏠</div>
                    <h3 className="text-xl font-bold text-white mb-1">Create Room</h3>
                    <p className="text-amber-100 text-sm">Start your own game room</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/top-players')}
                  className="group relative bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-xl p-6 text-left shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 group-hover:animate-pulse">🏆</div>
                    <h3 className="text-xl font-bold text-white mb-1">Top Players</h3>
                    <p className="text-yellow-100 text-sm">View leaderboard rankings</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="group relative bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 rounded-xl p-6 text-left shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">🛒</div>
                    <h3 className="text-xl font-bold text-white mb-1">Shop</h3>
                    <p className="text-pink-100 text-sm">Buy items and upgrades</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Top Players Preview */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">🏆 Top Players</h2>
                <button
                  onClick={() => navigate('/top-players')}
                  className="text-teal-300 hover:text-teal-200 font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  View All <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPlayers.slice(0, 3).map((player, index) => (
                  <div
                    key={player.rank}
                    className={`bg-gradient-to-br ${
                      index === 0
                        ? 'from-yellow-500/80 to-yellow-600/80 border-yellow-400/50'
                        : index === 1
                        ? 'from-gray-400/80 to-gray-500/80 border-gray-300/50'
                        : 'from-amber-600/80 to-amber-700/80 border-amber-500/50'
                    } backdrop-blur-sm rounded-xl p-6 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                    onClick={() => navigate('/top-players')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{player.username}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-white/90 flex items-center gap-1">
                            <span>🏆</span> {player.wins} Wins
                          </span>
                          <span className="text-yellow-200 flex items-center gap-1">
                            <span>💰</span> {player.bounty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {userRank && (
                <div className="mt-4 bg-teal-800/50 rounded-xl p-4 border border-teal-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <div className="text-sm text-teal-300">Your Rank</div>
                        <div className="text-xl font-bold text-white">#{userRank}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/top-players')}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                    >
                      View Full Leaderboard →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Shop Items */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">🛒 Featured Shop Items</h2>
                <button
                  onClick={() => navigate('/shop')}
                  className="text-teal-300 hover:text-teal-200 font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  View All <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredShopItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-br from-teal-800/50 to-purple-800/50 backdrop-blur-sm rounded-xl p-6 border-2 border-teal-600/50 hover:border-yellow-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    onClick={() => navigate('/shop')}
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-teal-600/50 text-white">
                        {item.category.toUpperCase()}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center">{item.name}</h3>
                    <p className="text-sm text-teal-200 mb-3 text-center">{item.description}</p>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-300 flex items-center justify-center gap-1">
                        <span>{item.price}</span>
                        <span className="text-sm">💰</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Games Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">🔥 Popular Games</h2>
                <button
                  onClick={() => navigate('/lobby')}
                  className="text-teal-300 hover:text-teal-200 font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  View All <span>→</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-teal-200">Loading popular games...</p>
                </div>
              ) : popularRooms.length === 0 ? (
                <div className="bg-teal-800/30 rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">🎴</div>
                  <p className="text-gray-300 text-lg">No active rooms at the moment</p>
                  <button
                    onClick={() => navigate('/create-room')}
                    className="mt-4 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Create First Room
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularRooms.map((room) => (
                    <div
                      key={room.room_id}
                      className="group bg-gradient-to-br from-teal-800/40 to-purple-800/40 backdrop-blur-sm rounded-xl p-6 border-2 border-teal-600/50 hover:border-yellow-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                      onClick={() => navigate(`/game/${room.room_id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Room #{room.room_id}</h3>
                          <p className="text-teal-300 text-sm">by {room.creator}</p>
                        </div>
                        {getStatusBadge(room.status)}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-teal-200 flex items-center gap-2">
                            <span>💰</span> Bonus
                          </span>
                          <span className="text-yellow-300 font-bold">{room.bonus || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-teal-200 flex items-center gap-2">
                            <span>💵</span> Entry Fee
                          </span>
                          <span className="text-green-300 font-bold">{room.fee || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-teal-200 flex items-center gap-2">
                            <span>👥</span> Players
                          </span>
                          <span className="text-white font-bold">
                            {room.members} / {room.size || 0}
                          </span>
                        </div>
                      </div>

                      {room.status === 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/game/${room.room_id}`)
                          }}
                          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 transform group-hover:scale-105"
                        >
                          Join Game 🎮
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Game Features */}
            <div className="bg-gradient-to-br from-teal-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-8 border-2 border-teal-600/50">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">🎴 Why Play Our Card Game? 🎴</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🃏</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Classic Gameplay</h3>
                  <p className="text-teal-200">Experience traditional card game mechanics</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Fast Matches</h3>
                  <p className="text-teal-200">Quick rounds for instant fun</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🏅</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Compete & Win</h3>
                  <p className="text-teal-200">Climb the leaderboard and earn rewards</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Shop & Customize</h3>
                  <p className="text-teal-200">Buy items, avatars, and powerups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

