import { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ToastContext'

type User = {
  name: string
  email: string
  username: string
  phone?: string
}

type UserContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const login = (data: User) => {
    setUser(data)
    toast.success(`Welcome, @${data.username}!`)
    navigate('/home')
  }

  const logout = () => {
    setUser(null)
    toast.info('You have been logged out.')
    navigate('/signin')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
