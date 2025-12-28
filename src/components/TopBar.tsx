import { useUser } from '../context/UserContext'
import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

const TopBar = () => {
  const { user, logout } = useUser()

  if (!user) return null

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 bg-vscode-sidebar sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-vscode-text">{user.name}</h1>
        <p className="text-sm text-vscode-text-muted">@{user.username}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-vscode-accent underline text-sm hover:text-vscode-text transition"
          title="Ir para tela inicial"
        >
          Início
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow"
          title="Logout"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default TopBar
