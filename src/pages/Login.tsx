import { useState } from 'react'
import { useUser } from '../context/UserContext'

const Login = () => {
  const { login } = useUser()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && username) {
      login({ name, email, username })
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-vscode-bg">
      <form
        onSubmit={handleSubmit}
        className="bg-vscode-sidebar text-vscode-text p-8 rounded-lg shadow-xl space-y-4 w-full max-w-sm border border-vscode-border"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-vscode-input text-vscode-text border border-vscode-border p-3 rounded outline-none focus:ring-2 focus:ring-vscode-accent placeholder-vscode-text-muted"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-vscode-input text-vscode-text border border-vscode-border p-3 rounded outline-none focus:ring-2 focus:ring-vscode-accent placeholder-vscode-text-muted"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-vscode-input text-vscode-text border border-vscode-border p-3 rounded outline-none focus:ring-2 focus:ring-vscode-accent placeholder-vscode-text-muted"
        />

        <button
          type="submit"
          className="bg-vscode-accent text-white font-semibold w-full py-3 rounded hover:bg-vscode-accent-hover transition"
        >
          Enter
        </button>
      </form>
    </div>
  )
}

export default Login
