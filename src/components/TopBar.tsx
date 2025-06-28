import { useUser } from '../context/UserContext'

const TopBar = () => {
  const { user, logout } = useUser()

  if (!user) return null

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-lg font-semibold">{user.name}</h1>
        <p className="text-sm text-brown-100">@{user.username}</p>
      </div>
      <button
        onClick={logout}
        className="bg-brown px-3 py-1 rounded hover:bg-brown-dark"
      >
        Logout
      </button>
    </header>
  )
}

export default TopBar
