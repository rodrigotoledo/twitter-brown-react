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
    <div className="h-screen flex items-center justify-center bg-brown-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-brown-dark p-6 rounded-xl shadow-md space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-brown"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-brown"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-brown"
        />

        <button
          type="submit"
          className="bg-brown text-white font-semibold w-full py-2 rounded hover:bg-brown-dark transition"
        >
          Enter
        </button>
      </form>
    </div>
  )
}

export default Login
