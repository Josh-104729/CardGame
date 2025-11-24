import { useParams } from 'react-router-dom'
import GameHeader from '../components/GameHeader'
import GameTable from '../components/GameTable'
import PlayerHand from '../components/PlayerHand'
import GameControls from '../components/GameControls'
import GameStatus from '../components/GameStatus'
import ProtectedRoute from '../components/ProtectedRoute'

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>()

  // Mock data for game
  const opponents = [
    { name: 'Player 1', cardCount: 5, position: 'top' as const, isActive: true },
    { name: 'Player 2', cardCount: 7, position: 'left' as const },
    { name: 'Player 3', cardCount: 6, position: 'right' as const },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-6xl mb-4">
            <GameStatus currentPlayer="Player 1" lastPlay="3 cards" round={1} />
          </div>
          <GameTable opponents={opponents} />
          <div className="mt-8 w-full max-w-6xl">
            <PlayerHand />
          </div>
          <div className="mt-6">
            <GameControls />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

