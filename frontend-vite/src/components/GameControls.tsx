export default function GameControls() {
  return (
    <div className="flex gap-4 items-center justify-center mt-6">
      <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200">
        Play Cards
      </button>
      <button className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200">
        Pass
      </button>
      <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200">
        Exit
      </button>
    </div>
  )
}

