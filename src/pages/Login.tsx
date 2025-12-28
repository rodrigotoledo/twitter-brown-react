import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { UserPlus, KeyRound } from 'lucide-react'
import MatrixLayout from '../components/MatrixLayout';

const Login = () => {
  const { user, login } = useUser()
  const navigate = useNavigate();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (user) navigate('/home')
  }, [user, navigate])

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !username) {
      setError('Preencha todos os campos.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Erro ao autenticar.');
        return;
      }
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        window.dispatchEvent(new CustomEvent('tokenSet'));
      }
      login({ name: data.name || name, email: data.email || email, username: data.username || username });
    } catch {
      setError('Erro de conexão com o servidor.');
    }
  }

  return (
    <MatrixLayout>
      <div className='flex justify-center items-center min-h-screen'>
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-vscode-sidebar text-vscode-text p-8 rounded-lg shadow-xl space-y-4 w-full max-w-sm border border-vscode-border backdrop-blur-sm bg-opacity-90"
        >
          <h1 className="text-2xl font-bold text-center">Entrar</h1>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-vscode-input text-vscode-text border border-vscode-border p-3 rounded outline-none focus:border-vscode-border placeholder-vscode-text-muted"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-vscode-input text-vscode-text border border-vscode-border p-3 rounded outline-none focus:border-vscode-border placeholder-vscode-text-muted"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-vscode-input text-vscode-text border border-vscode-border p-3 rounded outline-none focus:border-vscode-border placeholder-vscode-text-muted"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow text-center"
          >
            <span className="flex items-center gap-2 mx-auto"><KeyRound size={18} /> Entrar</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-semibold text-vscode-accent border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow mt-2 text-center"
            onClick={() => navigate('/signup')}
          >
            <span className="flex items-center gap-2 mx-auto"><UserPlus size={18} /> Criar conta</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center text-xs text-vscode-accent mt-1 underline text-center"
            onClick={() => navigate('/forgot')}
          >
            <span className="mx-auto">Esqueci a senha</span>
          </button>
        </form>
      </div>
    </MatrixLayout>
  )
}

export default Login
