import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GameHeader from '../components/GameHeader'
import ProtectedRoute from '../components/ProtectedRoute'
import { apiService } from '../services/api'

interface TopPlayer {
  username: string
  wins: number
  bounty: number
  avatar?: string
  rank: number
}

export default function TopPlayersPage() {
  const navigate = useNavigate()
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call when backend endpoint is ready
    const fetchTopPlayers = async () => {
      try {
        // Simulated data for now
        const mockPlayers: TopPlayer[] = [
          { username: 'CardMaster', wins: 125, bounty: 5000, rank: 1 },
          { username: 'AcePlayer', wins: 98, bounty: 4200, rank: 2 },
          { username: 'LuckyWinner', wins: 87, bounty: 3800, rank: 3 },
          { username: 'GameChanger', wins: 76, bounty: 3500, rank: 4 },
          { username: 'ProGamer', wins: 65, bounty: 3200, rank: 5 },
          { username: 'CardKing', wins: 54, bounty: 2900, rank: 6 },
          { username: 'Winner99', wins: 43, bounty: 2600, rank: 7 },
          { username: 'Champion', wins: 38, bounty: 2400, rank: 8 },
        ]
        setTopPlayers(mockPlayers)
      } catch (error) {
        console.error('Error fetching top players:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopPlayers()
  }, [])

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/80 to-yellow-600/80 border-yellow-400/50'
    if (rank === 2) return 'from-gray-400/80 to-gray-500/80 border-gray-300/50'
    if (rank === 3) return 'from-amber-600/80 to-amber-700/80 border-amber-500/50'
    return 'from-teal-800/50 to-purple-800/50 border-teal-600/50'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  🏆 Top Players 🏆
                </span>
              </h1>
              <p className="text-xl text-teal-200">See who's dominating the leaderboard</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-teal-200">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top 3 Podium */}
                {topPlayers.length >= 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 2nd Place */}
                    <div className={`bg-gradient-to-br ${getRankColor(2)} backdrop-blur-sm rounded-xl p-6 border-2 shadow-xl transform hover:scale-105 transition-all duration-300 order-2 md:order-1`}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">🥈</div>
                        <div className="w-20 h-20 bg-teal-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
                          {topPlayers[1].username[0].toUpperCase()}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{topPlayers[1].username}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-yellow-300">🏆</span>
                            <span className="text-white font-semibold">{topPlayers[1].wins} Wins</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-yellow-300">💰</span>
                            <span className="text-white font-semibold">{topPlayers[1].bounty} Bounty</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className={`bg-gradient-to-br ${getRankColor(1)} backdrop-blur-sm rounded-xl p-8 border-2 shadow-2xl transform hover:scale-105 transition-all duration-300 order-1 md:order-2 relative`}>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                        CHAMPION
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-6xl mb-2">🥇</div>
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white ring-4 ring-yellow-300/50">
                          {topPlayers[0].username[0].toUpperCase()}
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">{topPlayers[0].username}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-yellow-200">🏆</span>
                            <span className="text-white font-bold text-lg">{topPlayers[0].wins} Wins</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-yellow-200">💰</span>
                            <span className="text-white font-bold text-lg">{topPlayers[0].bounty} Bounty</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className={`bg-gradient-to-br ${getRankColor(3)} backdrop-blur-sm rounded-xl p-6 border-2 shadow-xl transform hover:scale-105 transition-all duration-300 order-3`}>
                      <div className="text-center">
                        <div className="text-5xl mb-2">🥉</div>
                        <div className="w-20 h-20 bg-teal-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
                          {topPlayers[2].username[0].toUpperCase()}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{topPlayers[2].username}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-yellow-300">🏆</span>
                            <span className="text-white font-semibold">{topPlayers[2].wins} Wins</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-yellow-300">💰</span>
                            <span className="text-white font-semibold">{topPlayers[2].bounty} Bounty</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rest of the Leaderboard */}
                <div className="space-y-3">
                  {topPlayers.slice(3).map((player) => (
                    <div
                      key={player.rank}
                      className={`bg-gradient-to-br ${getRankColor(player.rank)} backdrop-blur-sm rounded-xl p-4 border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-2xl font-bold text-white">{getRankBadge(player.rank)}</div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-xl font-bold text-white">
                            {player.username[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{player.username}</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-teal-200 flex items-center gap-1">
                              <span>🏆</span> {player.wins} Wins
                            </span>
                            <span className="text-yellow-300 flex items-center gap-1">
                              <span>💰</span> {player.bounty} Bounty
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

