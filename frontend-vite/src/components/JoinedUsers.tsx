interface RoomUser {
  username: string
  bounty: number
  exitreq: boolean
  src: string
}

interface JoinedUsersProps {
  users: RoomUser[]
  currentUsername: string
  roomSize: number
}

export default function JoinedUsers({ users, currentUsername, roomSize }: JoinedUsersProps) {
  return (
    <div className="bg-gradient-to-br from-teal-900/80 to-teal-800/80 rounded-xl p-6 border-2 border-teal-600/50 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>👥</span>
          <span>Joined Players</span>
        </h3>
        <span className="text-teal-300 text-sm font-semibold">
          {users.length} / {roomSize}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-teal-300/70">Waiting for players to join...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => {
            const isCurrentUser = user.username === currentUsername
            const isHost = index === 0

            return (
              <div
                key={user.username}
                className={`bg-gradient-to-br ${
                  isCurrentUser
                    ? 'from-amber-700/60 to-amber-800/60 border-amber-500'
                    : 'from-teal-800/50 to-teal-700/50 border-teal-600'
                } rounded-lg p-4 border-2 transition-all duration-200 hover:scale-105 shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    {user.src ? (
                      <img
                        src={user.src}
                        alt={user.username}
                        className="w-12 h-12 rounded-full border-2 border-white/50 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 border-2 border-white/50 flex items-center justify-center text-white font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isHost && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-1">
                        <span className="text-xs">👑</span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm truncate">{user.username}</p>
                      {isCurrentUser && (
                        <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-teal-300 text-xs">💰</span>
                      <span className="text-teal-200 text-xs font-semibold">{user.bounty}</span>
                    </div>
                  </div>
                </div>

                {/* Exit Request Indicator */}
                {user.exitreq && (
                  <div className="mt-2 pt-2 border-t border-red-500/30">
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Exit Requested</span>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Empty Slots */}
      {users.length < roomSize && (
        <div className="mt-4 pt-4 border-t border-teal-700/50">
          <p className="text-teal-300/70 text-sm text-center">
            {roomSize - users.length} slot{roomSize - users.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}
    </div>
  )
}

