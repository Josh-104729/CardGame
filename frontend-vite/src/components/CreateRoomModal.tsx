import { useState } from 'react'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const SIZE_OPTIONS = [3, 4, 5]
const BONUS_OPTIONS = [100, 300, 500]

export default function CreateRoomModal({ isOpen, onClose, onSuccess }: CreateRoomModalProps) {
  const { user } = useAuth()
  const [selectedSize, setSelectedSize] = useState<number>(4)
  const [selectedBonus, setSelectedBonus] = useState<number>(100)
  const [fee, setFee] = useState<number>(50)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string>('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!user) {
      setError('You must be logged in to create a room')
      return
    }

    if (fee < 0) {
      setError('Entry fee must be a positive number')
      return
    }

    setIsCreating(true)

    try {
      const response = await apiService.createRoom({
        creator: user.username,
        bonus: selectedBonus,
        fee: fee,
        size: selectedSize,
        status: 0, // Waiting status
      })

      if (response.variant === 'success' && response.roomID > 0) {
        handleClose()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setError(response.msg || 'Failed to create room')
      }
    } catch (err) {
      console.error('Create room error:', err)
      setError('An error occurred while creating the room')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setError('')
      setSelectedSize(4)
      setSelectedBonus(100)
      setFee(50)
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isCreating) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-teal-900/95 to-teal-800/95 rounded-2xl p-8 w-full max-w-md mx-4 border-2 border-teal-500/50 shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span>🏠</span>
            <span>Create New Room</span>
          </h2>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="text-teal-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-teal-200 mb-3">
              Room Size (Players)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  disabled={isCreating}
                  className={`py-3 px-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105'
                      : 'bg-teal-800/50 text-teal-200 hover:bg-teal-700/70 hover:text-white border-2 border-teal-600/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Bonus Selection */}
          <div>
            <label className="block text-sm font-semibold text-teal-200 mb-3">
              Bonus Prize
            </label>
            <div className="grid grid-cols-3 gap-3">
              {BONUS_OPTIONS.map((bonus) => (
                <button
                  key={bonus}
                  type="button"
                  onClick={() => setSelectedBonus(bonus)}
                  disabled={isCreating}
                  className={`py-3 px-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                    selectedBonus === bonus
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg scale-105'
                      : 'bg-teal-800/50 text-teal-200 hover:bg-teal-700/70 hover:text-white border-2 border-teal-600/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {bonus}
                </button>
              ))}
            </div>
          </div>

          {/* Entry Fee */}
          <div>
            <label htmlFor="fee" className="block text-sm font-semibold text-teal-200 mb-2">
              Entry Fee
            </label>
            <input
              id="fee"
              type="number"
              min="0"
              value={fee}
              onChange={(e) => setFee(parseInt(e.target.value) || 0)}
              disabled={isCreating}
              className="w-full px-4 py-3 bg-teal-800/50 border-2 border-teal-600/50 rounded-xl text-white placeholder-teal-300/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <p className="mt-1 text-xs text-teal-300/70">
              Amount players need to pay to join this room
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border-2 border-red-600/50 rounded-xl p-3">
              <p className="text-red-200 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/70 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  <span>Creating...</span>
                </span>
              ) : (
                'Create Room'
              )}
            </button>
          </div>
        </form>

        {/* Room Preview */}
        <div className="mt-6 pt-6 border-t border-teal-700/50">
          <p className="text-xs text-teal-300/70 mb-2">Room Preview:</p>
          <div className="bg-teal-800/30 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-teal-300/70">Size:</span>
              <span className="text-white font-semibold">{selectedSize} players</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-teal-300/70">Bonus:</span>
              <span className="text-white font-semibold">{selectedBonus} 🎁</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-teal-300/70">Entry Fee:</span>
              <span className="text-white font-semibold">{fee} 💰</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

