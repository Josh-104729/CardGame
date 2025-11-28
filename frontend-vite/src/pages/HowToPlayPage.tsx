import { useNavigate } from 'react-router-dom'
import GameHeader from '../components/GameHeader'
import ProtectedRoute from '../components/ProtectedRoute'
import Card from '../components/Card'

export default function HowToPlayPage() {
  const navigate = useNavigate()

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  How To Play 🎴
                </span>
              </h1>
              <p className="text-xl text-teal-200">Learn the rules and master the game!</p>
            </div>

            {/* Overview Section */}
            <div className="bg-gradient-to-br from-teal-800/50 to-teal-900/50 backdrop-blur-sm rounded-xl p-8 border-2 border-teal-600/50 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <span>📖</span> Game Overview
              </h2>
              <p className="text-teal-200 text-lg leading-relaxed mb-4">
                This is a multiplayer card game where players compete to be the first to play all their cards. 
                Players take turns playing valid card combinations, and each play must beat the previous one. 
                The last player to finish their cards loses and pays the bounty to the winner.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-teal-700/30 rounded-lg p-4 border border-teal-600/50">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-1">Multiplayer</h3>
                  <p className="text-sm text-teal-200">Play with 2-6 players in a room</p>
                </div>
                <div className="bg-teal-700/30 rounded-lg p-4 border border-teal-600/50">
                  <div className="text-2xl mb-2">⏱️</div>
                  <h3 className="text-lg font-semibold text-white mb-1">Time Limit</h3>
                  <p className="text-sm text-teal-200">10 seconds per turn</p>
                </div>
                <div className="bg-teal-700/30 rounded-lg p-4 border border-teal-600/50">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="text-lg font-semibold text-white mb-1">Bounty System</h3>
                  <p className="text-sm text-teal-200">Win bounty from other players</p>
                </div>
              </div>
            </div>

            {/* Card Types Section */}
            <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-8 border-2 border-purple-600/50 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span>🃏</span> Card Types
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="mb-2">
                    <Card suit={0} rank={1} />
                  </div>
                  <p className="text-sm text-purple-200 font-semibold">Spade</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <Card suit={1} rank={1} />
                  </div>
                  <p className="text-sm text-purple-200 font-semibold">Heart</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <Card suit={2} rank={1} />
                  </div>
                  <p className="text-sm text-purple-200 font-semibold">Crova</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <Card suit={3} rank={1} />
                  </div>
                  <p className="text-sm text-purple-200 font-semibold">Diamond</p>
                </div>
              </div>
              <div className="bg-purple-700/30 rounded-lg p-4 border border-purple-600/50">
                <h3 className="text-lg font-semibold text-white mb-2">Special Cards</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="mb-2">
                      <Card suit={4} rank={0} />
                    </div>
                    <p className="text-xs text-purple-200">SoWang</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2">
                      <Card suit={5} rank={0} />
                    </div>
                    <p className="text-xs text-purple-200">TaWang</p>
                  </div>
                  <div className="flex-1 text-purple-200 text-sm">
                    <p>These are the special joker cards. When played together (Ta + So), they form the strongest combination called "Taso" (폭탄) that beats everything!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Rankings Section */}
            <div className="bg-gradient-to-br from-amber-800/50 to-amber-900/50 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-600/50 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span>📊</span> Card Rankings
              </h2>
              <div className="space-y-4">
                <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <h3 className="text-lg font-semibold text-white mb-3">Number Values</h3>
                  <p className="text-amber-200 mb-3">
                    Cards are numbered 1-13, where:
                  </p>
                  <ul className="list-disc list-inside text-amber-200 space-y-1 ml-4">
                    <li>1 = 3 (lowest)</li>
                    <li>2 = 4</li>
                    <li>3 = 5</li>
                    <li>...</li>
                    <li>12 = Ace</li>
                    <li>13 = 2 (highest regular card)</li>
                  </ul>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-amber-200">Example:</span>
                    <div className="flex gap-1">
                      <Card suit={0} rank={13} />
                      <span className="text-white font-bold text-xl mx-2">beats</span>
                      <Card suit={0} rank={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Valid Combinations Section */}
            <div className="bg-gradient-to-br from-pink-800/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-8 border-2 border-pink-600/50 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span>🎯</span> Valid Card Combinations
              </h2>
              <div className="space-y-6">
                {/* Single Card */}
                <div className="bg-pink-700/30 rounded-lg p-5 border border-pink-600/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex gap-1">
                        <Card suit={0} rank={5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Single Card (1 card)</h3>
                      <p className="text-pink-200 mb-2">Play one card. Must be higher than the previous single card.</p>
                      <p className="text-sm text-pink-300">Example: 5 of Spades</p>
                    </div>
                  </div>
                </div>

                {/* Twins */}
                <div className="bg-pink-700/30 rounded-lg p-5 border border-pink-600/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex gap-1">
                        <Card suit={0} rank={7} />
                        <Card suit={1} rank={7} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Twins/Pair (2 cards)</h3>
                      <p className="text-pink-200 mb-2">Play two cards of the same rank. Can include one joker (So or Ta).</p>
                      <p className="text-sm text-pink-300">Example: Two 7s, or 7 + SoWang</p>
                    </div>
                  </div>
                </div>

                {/* Triplets */}
                <div className="bg-pink-700/30 rounded-lg p-5 border border-pink-600/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex gap-1">
                        <Card suit={0} rank={9} />
                        <Card suit={1} rank={9} />
                        <Card suit={2} rank={9} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Triplets/Bang (3 cards)</h3>
                      <p className="text-pink-200 mb-2">Play three cards of the same rank. Can include one joker. Beats singles and pairs.</p>
                      <p className="text-sm text-pink-300">Example: Three 9s, or Two 9s + SoWang</p>
                    </div>
                  </div>
                </div>

                {/* Quads */}
                <div className="bg-pink-700/30 rounded-lg p-5 border border-pink-600/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex gap-1">
                        <Card suit={0} rank={11} />
                        <Card suit={1} rank={11} />
                        <Card suit={2} rank={11} />
                        <Card suit={3} rank={11} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Quads/Madae (4 cards)</h3>
                      <p className="text-pink-200 mb-2">Play four cards of the same rank. Beats singles, pairs, and triplets.</p>
                      <p className="text-sm text-pink-300">Example: Four Jacks (11s)</p>
                    </div>
                  </div>
                </div>

                {/* Bomb */}
                <div className="bg-gradient-to-r from-red-700/50 to-orange-700/50 rounded-lg p-5 border-2 border-red-500/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex gap-1">
                        <Card suit={4} rank={0} />
                        <Card suit={5} rank={0} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Bomb/Taso (Ta + So)</h3>
                      <p className="text-red-200 mb-2 font-semibold">The strongest combination! Beats everything except another Taso.</p>
                      <p className="text-sm text-red-300">Example: SoWang + TaWang</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gameplay Rules Section */}
            <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-8 border-2 border-blue-600/50 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span>🎮</span> Gameplay Rules
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-700/30 rounded-lg p-5 border border-blue-600/50">
                  <h3 className="text-xl font-semibold text-white mb-3">1. Starting the Game</h3>
                  <ul className="list-disc list-inside text-blue-200 space-y-2 ml-4">
                    <li>Join or create a room with 2-6 players</li>
                    <li>Each player receives cards from a shuffled 54-card deck</li>
                    <li>The host starts the game when the room is full</li>
                    <li>Players are arranged in order, with you at the bottom</li>
                  </ul>
                </div>

                <div className="bg-blue-700/30 rounded-lg p-5 border border-blue-600/50">
                  <h3 className="text-xl font-semibold text-white mb-3">2. Taking Your Turn</h3>
                  <ul className="list-disc list-inside text-blue-200 space-y-2 ml-4">
                    <li>You have 10 seconds to play cards or pass</li>
                    <li>Select valid card combinations from your hand</li>
                    <li>Your play must beat the previous player's cards</li>
                    <li>Click "Shut" to play your selected cards</li>
                    <li>Click "Pass" to skip your turn (if you're not the "son")</li>
                  </ul>
                </div>

                <div className="bg-blue-700/30 rounded-lg p-5 border border-blue-600/50">
                  <h3 className="text-xl font-semibold text-white mb-3">3. Beating Previous Cards</h3>
                  <ul className="list-disc list-inside text-blue-200 space-y-2 ml-4">
                    <li><strong>Single:</strong> Play a higher single card (e.g., 6 beats 5, 2 beats Ace)</li>
                    <li><strong>Pair:</strong> Play a higher pair (e.g., pair of 8s beats pair of 7s)</li>
                    <li><strong>Triplets:</strong> Beats singles and pairs, or play higher triplets</li>
                    <li><strong>Quads:</strong> Beats singles, pairs, and triplets, or play higher quads</li>
                    <li><strong>Bomb (Taso):</strong> Beats everything! Only another Taso can beat it</li>
                    <li>You can always play a stronger combination type (e.g., triplets beat pairs)</li>
                  </ul>
                </div>

                <div className="bg-blue-700/30 rounded-lg p-5 border border-blue-600/50">
                  <h3 className="text-xl font-semibold text-white mb-3">4. Winning the Game</h3>
                  <ul className="list-disc list-inside text-blue-200 space-y-2 ml-4">
                    <li>The first player to play all their cards wins!</li>
                    <li>The winner receives bounty from all other players</li>
                    <li>Bounty amount = Room bonus × multiplier (from special cards)</li>
                    <li>Players with remaining cards lose bounty based on their remaining cards</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips & Strategies Section */}
            <div className="bg-gradient-to-br from-green-800/50 to-green-900/50 backdrop-blur-sm rounded-xl p-8 border-2 border-green-600/50 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span>💡</span> Tips & Strategies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-700/30 rounded-lg p-4 border border-green-600/50">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Save High Cards</h3>
                  <p className="text-sm text-green-200">Keep your 2s (13) and high cards for crucial moments</p>
                </div>
                <div className="bg-green-700/30 rounded-lg p-4 border border-green-600/50">
                  <div className="text-2xl mb-2">💣</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Use Taso Wisely</h3>
                  <p className="text-sm text-green-200">Save the Ta+So bomb for when you really need it</p>
                </div>
                <div className="bg-green-700/30 rounded-lg p-4 border border-green-600/50">
                  <div className="text-2xl mb-2">⏰</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Watch the Timer</h3>
                  <p className="text-sm text-green-200">You have 10 seconds per turn - plan ahead!</p>
                </div>
                <div className="bg-green-700/30 rounded-lg p-4 border border-green-600/50">
                  <div className="text-2xl mb-2">🔄</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Use Jokers</h3>
                  <p className="text-sm text-green-200">Jokers (So/Ta) can complete pairs and triplets</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate('/lobby')}
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-lg font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🎮 Start Playing
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-lg font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

