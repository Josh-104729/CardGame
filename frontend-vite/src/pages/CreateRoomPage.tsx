import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameHeader from '../components/GameHeader'
import ProtectedRoute from '../components/ProtectedRoute'

export default function CreateRoomPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    bonus: 0,
    fee: 0,
    size: 4,
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    
    // TODO: Implement create room API call
    // For now, just navigate back to lobby
    setTimeout(() => {
      setIsCreating(false)
      navigate('/lobby')
    }, 1000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Create New Room</h2>
              <p className="text-teal-200">Set up a new game room</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-teal-800/30 backdrop-blur-sm rounded-lg p-6 border border-teal-600/50">
              <div className="space-y-6">
                <div>
                  <label htmlFor="bonus" className="block text-sm font-medium text-teal-200 mb-2">
                    Bonus
                  </label>
                  <input
                    id="bonus"
                    type="number"
                    min="0"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fee" className="block text-sm font-medium text-teal-200 mb-2">
                    Entry Fee
                  </label>
                  <input
                    id="fee"
                    type="number"
                    min="0"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-teal-200 mb-2">
                    Room Size (Players)
                  </label>
                  <input
                    id="size"
                    type="number"
                    min="2"
                    max="8"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) || 2 })}
                    className="w-full px-4 py-2 bg-teal-800 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/lobby')}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    {isCreating ? 'Creating...' : 'Create Room'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

