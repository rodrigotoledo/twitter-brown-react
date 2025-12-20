import { useUser } from '../context/UserContext'

const TopBar = () => {
  const { user, logout } = useUser()

  if (!user) return null

  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-vscode-text">{user.name}</h1>
        <p className="text-sm text-vscode-text-muted">@{user.username}</p>
      </div>
      <button
        onClick={logout}
        className="bg-vscode-accent text-white px-4 py-2 rounded hover:bg-vscode-accent-hover transition"
      >
        Logout
      </button>
    </header>
  )
}

export default TopBar
