
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tweets/:username" element={<Home />} />
    </Routes>
  );
}

export default App
