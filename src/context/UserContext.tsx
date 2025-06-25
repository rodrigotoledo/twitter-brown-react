import { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type User = {
  name: string
  email: string
  username: string
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

  const login = (data: User) => {
    setUser(data)
    navigate('/home')
  }

  const logout = () => {
    setUser(null)
    navigate('/')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
