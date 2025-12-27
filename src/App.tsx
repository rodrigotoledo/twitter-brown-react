import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { PostsProvider } from './context/PostsContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <PostsProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </PostsProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
