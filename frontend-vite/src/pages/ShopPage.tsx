import { useState } from 'react'
import GameHeader from '../components/GameHeader'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

interface ShopItem {
  id: number
  name: string
  description: string
  price: number
  icon: string
  category: 'bounty' | 'avatar' | 'theme' | 'powerup'
}

export default function ShopPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const shopItems: ShopItem[] = [
    // Bounty Items
    { id: 1, name: 'Starter Pack', description: '100 Bounty Points', price: 4.99, icon: '💰', category: 'bounty' },
    { id: 2, name: 'Premium Pack', description: '500 Bounty Points', price: 19.99, icon: '💎', category: 'bounty' },
    { id: 3, name: 'Mega Pack', description: '1000 Bounty Points', price: 34.99, icon: '💵', category: 'bounty' },
    { id: 4, name: 'Ultimate Pack', description: '2500 Bounty Points', price: 79.99, icon: '💸', category: 'bounty' },
    
    // Avatars
    { id: 5, name: 'Golden Avatar', description: 'Exclusive golden frame', price: 99, icon: '👑', category: 'avatar' },
    { id: 6, name: 'Diamond Avatar', description: 'Premium diamond border', price: 149, icon: '💠', category: 'avatar' },
    { id: 7, name: 'Platinum Avatar', description: 'Elite platinum design', price: 199, icon: '✨', category: 'avatar' },
    
    // Themes
    { id: 8, name: 'Dark Theme', description: 'Sleek dark card theme', price: 49, icon: '🌙', category: 'theme' },
    { id: 9, name: 'Neon Theme', description: 'Vibrant neon colors', price: 49, icon: '🌈', category: 'theme' },
    { id: 10, name: 'Classic Theme', description: 'Traditional card design', price: 49, icon: '🃏', category: 'theme' },
    
    // Powerups
    { id: 11, name: 'Lucky Charm', description: 'Increase win chance by 10%', price: 79, icon: '🍀', category: 'powerup' },
    { id: 12, name: 'Double Bonus', description: '2x bonus for next 5 games', price: 129, icon: '⚡', category: 'powerup' },
  ]

  const categories = [
    { id: 'all', label: 'All Items', icon: '🛒' },
    { id: 'bounty', label: 'Bounty', icon: '💰' },
    { id: 'avatar', label: 'Avatars', icon: '👤' },
    { id: 'theme', label: 'Themes', icon: '🎨' },
    { id: 'powerup', label: 'Powerups', icon: '⚡' },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory)

  const handlePurchase = (item: ShopItem) => {
    // TODO: Implement purchase logic
    alert(`Purchase ${item.name} for ${item.price} bounty?`)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <GameHeader />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  🛒 Shop 🛒
                </span>
              </h1>
              <p className="text-xl text-teal-200">Enhance your gaming experience</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-6 py-3">
                <span className="text-yellow-300 text-2xl">💰</span>
                <div className="text-left">
                  <div className="text-xs text-yellow-200/80">Your Bounty</div>
                  <div className="text-2xl font-bold text-yellow-300">{user?.bounty || 0}</div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-teal-600/80 text-white shadow-lg scale-105'
                      : 'bg-teal-800/50 text-teal-200 hover:text-white hover:bg-teal-700/50'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* Shop Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gradient-to-br from-teal-800/50 to-purple-800/50 backdrop-blur-sm rounded-xl p-6 border-2 border-teal-600/50 hover:border-yellow-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Item Icon */}
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-600/50 text-white">
                      {item.category.toUpperCase()}
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-teal-200 mb-4">{item.description}</p>
                  </div>

                  {/* Price and Purchase */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-teal-300">Price</div>
                      <div className="text-2xl font-bold text-yellow-300 flex items-center gap-1">
                        <span>{item.price}</span>
                        {item.category === 'bounty' ? (
                          <span className="text-lg">💰</span>
                        ) : (
                          <span className="text-lg">Bounty</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={(user?.bounty || 0) < item.price}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        (user?.bounty || 0) >= item.price
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-teal-800/30 rounded-xl">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-300 text-lg">No items found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

