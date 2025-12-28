import { useEffect } from 'react';
import { useUser } from './context/UserContext';
// Helper to check backend health
const checkBackendHealth = async (apiUrl: string) => {
  try {
    const res = await fetch(apiUrl + '/health');
    return res.ok;
  } catch {
    return false;
  }
};
  const { user, logout } = useUser();
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (!user) return;
    checkBackendHealth(apiUrl).then((healthy) => {
      if (!healthy) {
        logout();
        window.location.href = '/signin';
      }
    });
  }, [user]);
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
            <Route path="/tweets/:username" element={<Home />} />
          </Routes>
        </PostsProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
