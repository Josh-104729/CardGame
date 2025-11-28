import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function GameHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/lobby', label: 'Rooms', icon: '🎮' },
    { path: '/top-players', label: 'Top Players', icon: '🏆' },
    { path: '/shop', label: 'Shop', icon: '🛒' },
    { path: '/how-to-play', label: 'How To Play', icon: '📖' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="w-full bg-gradient-to-r from-teal-900/95 via-teal-800/95 to-teal-900/95 backdrop-blur-md border-b-2 border-teal-600/50 shadow-2xl relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 group"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">
                🎴
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Card Game
              </h1>
            </button>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-teal-600/80 text-white shadow-lg scale-105'
                      : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* Bounty Display */}
                <div className="hidden sm:flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-2">
                  <span className="text-yellow-300 text-lg">💰</span>
                  <div className="text-right">
                    <div className="text-xs text-yellow-200/80">Bounty</div>
                    <div className="text-sm font-bold text-yellow-300">{user.bounty || 0}</div>
                  </div>
                </div>

                {/* User Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 bg-teal-800/50 hover:bg-teal-700/50 rounded-lg px-3 py-2 border border-teal-600/50 transition-all duration-200 hover:border-teal-400/50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-teal-400/50">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">{user.username[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-semibold text-white">{user.username}</div>
                      <div className="text-xs text-teal-300">Player</div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-teal-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-teal-800/95 to-teal-900/95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-teal-600/50 overflow-hidden z-[9999] transform transition-all duration-200 ease-out origin-top-right opacity-100 scale-100">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-teal-700/50 bg-teal-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-teal-400/50">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold text-xl">{user.username[0].toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">{user.username}</div>
                            <div className="text-xs text-teal-300">Bounty: {user.bounty || 0} 💰</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate('/profile')
                            setIsDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors duration-200 flex items-center gap-3"
                        >
                          <span className="text-lg">👤</span>
                          <span className="font-medium">Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/settings')
                            setIsDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors duration-200 flex items-center gap-3"
                        >
                          <span className="text-lg">⚙️</span>
                          <span className="font-medium">Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/dashboard')
                            setIsDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors duration-200 flex items-center gap-3"
                        >
                          <span className="text-lg">📊</span>
                          <span className="font-medium">Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/shop')
                            setIsDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors duration-200 flex items-center gap-3"
                        >
                          <span className="text-lg">🛒</span>
                          <span className="font-medium">Shop</span>
                        </button>
                        <div className="border-t border-teal-700/50 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm text-red-300 hover:text-red-200 hover:bg-red-600/30 transition-colors duration-200 flex items-center gap-3"
                        >
                          <span className="text-lg">🚪</span>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 mt-4 pt-4 border-t border-teal-700/50">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1 ${
                isActive(item.path)
                  ? 'bg-teal-600/80 text-white shadow-lg'
                  : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

