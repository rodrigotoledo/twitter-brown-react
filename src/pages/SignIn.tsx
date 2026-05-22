import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { useToast } from '../context/ToastContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SignIn = () => {
  const { login } = useUser()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        toast.error(body?.error?.message || 'Unable to sign in.')
        return
      }

      if (!body?.data?.token || !body?.data?.user) {
        toast.error('Signin response was missing authentication data.')
        return
      }

      localStorage.setItem('x_clone_token', body.data.token)
      login(body.data.user)
    } catch {
      toast.error('Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="bg-cursor-dark text-cursor-foreground p-8 rounded-2xl shadow-md space-y-5 w-full max-w-xl border border-cursor-border"
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
          disabled={isSubmitting}
          className="bg-cursor-accent text-cursor-on-accent font-bold w-full py-3 rounded-full hover:bg-cursor-accent-hover transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignIn
