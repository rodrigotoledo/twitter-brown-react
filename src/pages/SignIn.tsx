import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { useToast } from '../context/ToastContext'

const SignIn = () => {
  const { login } = useUser()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }
    const username = email.split('@')[0] || 'user'
    login({ name: username, email, username })
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="bg-cursor-dark text-cursor-foreground p-8 rounded-2xl shadow-md space-y-5 w-full max-w-sm border border-cursor-border"
      >
        <h1 className="text-3xl font-bold">Sign in to X</h1>

        <FormField
          id="signin-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormField
          id="signin-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-cursor-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="bg-cursor-accent text-cursor-on-accent font-bold w-full py-3 rounded-full hover:bg-cursor-accent-hover transition"
        >
          Sign in
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignIn
