import { useState, useMemo } from 'react'
import Card from '../components/Card'
import LoginModal from '../components/auth/LoginModal'
import RegisterModal from '../components/auth/RegisterModal'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Generate stable background card positions (only once on mount)
  const backgroundCards = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      suit: Math.floor(Math.random() * 4),
      rank: Math.floor(Math.random() * 13) + 1,
      animationDuration: 15 + Math.random() * 10,
      animationDelay: Math.random() * 5,
    }))
  }, [])

  // Sample cards for the landing page display
  const displayCards = [
    { suit: 0, rank: 1 },   // Ace of Spades
    { suit: 1, rank: 13 },  // King of Hearts
    { suit: 2, rank: 12 },  // Queen of Diamonds
    { suit: 3, rank: 11 },  // Jack of Clubs
    { suit: 1, rank: 1 },   // Ace of Hearts
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated background cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundCards.map((card, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${card.left}%`,
              top: `${card.top}%`,
              animation: `float ${card.animationDuration}s infinite ease-in-out`,
              animationDelay: `${card.animationDelay}s`,
            }}
          >
            <Card suit={card.suit} rank={card.rank} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-12 px-4">
        {/* Title with card-themed styling */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="transform rotate-12 animate-pulse">
              <Card suit={1} rank={1} />
            </div>
            <h1 className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl tracking-wide">
              <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
                CARD GAME
              </span>
            </h1>
            <div className="transform -rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <Card suit={0} rank={13} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl text-teal-200 font-light drop-shadow-lg">
            Play, Compete, Win!
          </p>
        </div>

        {/* Display cards fan */}
        <div className="flex items-center justify-center gap-2 md:gap-4 py-8">
          {displayCards.map((card, index) => (
            <div
              key={index}
              className="transform transition-all duration-500 hover:scale-110 hover:-translate-y-4"
              style={{
                transform: `rotate(${(index - 2) * 15}deg) translateY(${Math.abs(index - 2) * 10}px)`,
                animation: `cardFloat ${3 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <Card suit={card.suit} rank={card.rank} />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-4 pt-8">
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-12 py-5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xl font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-teal-500/50 border-2 border-teal-500"
          >
            🎮 Login to Play
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xl font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-amber-500/50 border-2 border-amber-500 block mx-auto"
          >
            ✨ Create Account
          </button>
        </div>

        {/* Game features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-teal-800/30 backdrop-blur-sm rounded-xl p-6 border border-teal-600/50">
            <div className="text-4xl mb-3">🃏</div>
            <h3 className="text-xl font-semibold mb-2">Classic Cards</h3>
            <p className="text-teal-200 text-sm">Traditional card game experience</p>
          </div>
          <div className="bg-teal-800/30 backdrop-blur-sm rounded-xl p-6 border border-teal-600/50">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-semibold mb-2">Multiplayer</h3>
            <p className="text-teal-200 text-sm">Play with friends online</p>
          </div>
          <div className="bg-teal-800/30 backdrop-blur-sm rounded-xl p-6 border border-teal-600/50">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Competitive</h3>
            <p className="text-teal-200 text-sm">Win matches and climb ranks</p>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}

