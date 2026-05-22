import { useUser } from '../context/UserContext'

const TopBar = () => {
  const { user, logout } = useUser()

  if (!user) return null

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-lg font-semibold">{user.name}</h1>
        <p className="text-sm text-cursor-muted">@{user.username}</p>
      </div>
      <button
        onClick={logout}
        className="bg-cursor-accent text-cursor-on-accent px-3 py-1 rounded hover:bg-cursor-accent-hover"
      >
        Logout
      </button>
    </header>
  )
}

export default TopBar
