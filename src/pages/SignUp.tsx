import { useState } from 'react'
import { useUser } from '../context/UserContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PhoneField from '../components/PhoneField'
import { useToast } from '../context/ToastContext'

const SignUp = () => {
  const { login } = useUser()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone || !username || !password) {
      toast.error('Please fill in all fields to create your account.')
      return
    }
    toast.success('Account created successfully!')
    login({ name, email, username, phone })
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="bg-cursor-dark text-cursor-foreground p-8 rounded-2xl shadow-md space-y-5 w-full max-w-sm border border-cursor-border"
      >
        <h1 className="text-3xl font-bold">Create your account</h1>

        <FormField
          id="signup-name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormField
          id="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PhoneField id="signup-phone" value={phone} onChange={setPhone} />

        <FormField
          id="signup-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <FormField
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-cursor-accent text-cursor-on-accent font-bold w-full py-3 rounded-full hover:bg-cursor-accent-hover transition"
        >
          Sign up
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignUp
