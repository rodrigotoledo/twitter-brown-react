import { useState } from 'react'
import { useUser } from '../context/UserContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PhoneField from '../components/PhoneField'
import { useToast } from '../context/ToastContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const SignUp = () => {
  const { login } = useUser()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !bio || !phone || !instagram || !username || !password || !passwordConfirm || !avatar) {
      toast.error('Please fill in all fields to create your account.')
      return
    }

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match.')
      return
    }

    if (!ALLOWED_AVATAR_TYPES.includes(avatar.type)) {
      toast.error('Avatar must be a JPEG, PNG, or WebP image.')
      return
    }

    if (avatar.size > MAX_AVATAR_SIZE) {
      toast.error('Avatar must be 5MB or smaller.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('bio', bio)
    formData.append('phone', phone)
    formData.append('instagram', instagram)
    formData.append('username', username)
    formData.append('password', password)
    formData.append('avatar', avatar)

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        body: formData,
      })
      const body = await response.json().catch(() => null)

      if (!response.ok) {
        toast.error(body?.error?.message || 'Unable to create your account.')
        return
      }

      if (!body?.data?.token || !body?.data?.user) {
        toast.error('Signup response was missing authentication data.')
        return
      }

      localStorage.setItem('x_clone_token', body.data.token)
      toast.success('Account created successfully!')
      login(body.data.user)
    } catch {
      toast.error('Unable to create your account right now.')
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
        <h1 className="text-3xl font-bold">Create your account</h1>

        <div className="grid gap-3 md:grid-cols-2">
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
        </div>

        <PhoneField id="signup-phone" value={phone} onChange={setPhone} />

        <FormField
          id="signup-avatar"
          label="Avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          required
        />

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            id="signup-bio"
            label="Bio"
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <FormField
            id="signup-instagram"
            label="Instagram"
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            required
          />
        </div>

        <FormField
          id="signup-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            id="signup-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormField
            id="signup-password-confirm"
            label="Confirm Password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-cursor-accent text-cursor-on-accent font-bold w-full py-3 rounded-full hover:bg-cursor-accent-hover transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignUp
