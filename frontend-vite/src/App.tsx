import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import CreateRoomPage from './pages/CreateRoomPage'
import TopPlayersPage from './pages/TopPlayersPage'
import ShopPage from './pages/ShopPage'
import HowToPlayPage from './pages/HowToPlayPage'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-game-bg to-teal-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-teal-200">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-game-bg to-teal-900">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/lobby"
            element={
              isAuthenticated ? <LobbyPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/create-room"
            element={
              isAuthenticated ? <CreateRoomPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/top-players"
            element={
              isAuthenticated ? <TopPlayersPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/shop"
            element={
              isAuthenticated ? <ShopPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/how-to-play"
            element={
              isAuthenticated ? <HowToPlayPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/game/:roomId"
            element={
              isAuthenticated ? <GamePage /> : <Navigate to="/" replace />
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

