import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ToastContext'

export type User = {
  id?: string
  name: string
  email: string
  username: string
  avatar_url?: string
  bio?: string
  phone?: string
  instagram?: string
}

type UserContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)
const USER_STORAGE_KEY = 'x_clone_user'
const TOKEN_STORAGE_KEY = 'x_clone_token'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (!stored) return null

    try {
      return JSON.parse(stored) as User
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY)
      return null
    }
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) return

    const refreshCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const body = await response.json().catch(() => null)

        if (!response.ok || !body?.data) return

        setUser(body.data)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(body.data))
      } catch {
        // Keep the locally stored user when the API is temporarily unavailable.
      }
    }

    refreshCurrentUser()
  }, [])

  const login = (data: User) => {
    setUser(data)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
    toast.success(`Welcome, @${data.username}!`)
    navigate('/home')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    toast.info('You have been logged out.')
    navigate('/signin')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
