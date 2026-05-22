import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { useToast } from '../context/ToastContext'

const ForgotPassword = () => {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address.')
      return
    }
    setSubmitted(true)
    toast.success(
      `If an account exists for ${email}, you will receive reset instructions shortly.`
    )
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="bg-cursor-dark text-cursor-foreground p-8 rounded-2xl shadow-md space-y-5 w-full max-w-sm border border-cursor-border"
      >
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="text-sm text-cursor-muted">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {!submitted && (
          <FormField
            id="forgot-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        <button
          type="submit"
          disabled={submitted}
          className="bg-cursor-accent text-cursor-on-accent font-bold w-full py-3 rounded-full hover:bg-cursor-accent-hover transition disabled:opacity-50"
        >
          {submitted ? 'Email sent' : 'Send reset link'}
        </button>

        <div className="text-center">
          <Link to="/signin" className="text-sm text-cursor-accent hover:underline">
            Back to Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
