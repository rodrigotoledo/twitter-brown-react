import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User as UserIcon, KeyRound, Eye, EyeOff } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { useUser } from '../context/UserContext';
import MatrixLayout from '../components/MatrixLayout';
import { useQueryClient } from '@tanstack/react-query';

const Signup = () => {
  const { login } = useUser();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirmPassword
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Erro ao registrar.');
        return;
      }
      // Sucesso: loga automaticamente
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        queryClient.invalidateQueries(['latestTweets']);
      }
      login({
        name: data.name || form.name,
        username: data.username || form.username,
        email: data.email || form.email
      });
    } catch (_) {
      setError('Erro de conexão com o servidor.');
    }
  };

  const fillWithFake = () => {
    setForm({
      name: faker.person.fullName(),
      username: faker.internet.username().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: 'Senha123!',
      confirmPassword: 'Senha123!'
    });
    setError('');
  };

  return (
    <MatrixLayout>
      <div className='flex justify-center items-center min-h-screen'>
        <form onSubmit={handleSubmit} className="bg-vscode-sidebar p-8 rounded shadow-lg border border-vscode-border w-full max-w-md flex flex-col gap-4">
          <h2 className="text-xl font-bold text-vscode-text mb-2 flex items-center gap-2">
            <UserIcon size={22} /> Criar conta
          </h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Nome</label>
            <div className="flex items-center gap-2 bg-vscode-input border border-vscode-border rounded px-2">
              <UserIcon size={16} />
              <input name="name" value={form.name} onChange={handleChange} className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!" autoComplete="name" placeholder="Nome completo" title="Nome completo" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Username</label>
            <div className="flex items-center gap-2 bg-vscode-input border border-vscode-border rounded px-2">
              <UserIcon size={16} />
              <input name="username" value={form.username} onChange={handleChange} className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!" autoComplete="username" placeholder="Seu usuário" title="Seu usuário" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Email</label>
            <div className="flex items-center gap-2 bg-vscode-input border border-vscode-border rounded px-2">
              <Mail size={16} />
              <input name="email" type="email" value={form.email} onChange={handleChange} className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!" autoComplete="email" placeholder="Seu e-mail" title="Seu e-mail" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Senha</label>
            <div className="flex items-center gap-2 bg-vscode-input border border-vscode-border rounded px-2">
              <KeyRound size={16} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                placeholder="Senha"
                title="Senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="text-vscode-accent hover:text-vscode-text-muted focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Confirmar senha</label>
            <div className="flex items-center gap-2 bg-vscode-input border border-vscode-border rounded px-2">
              <KeyRound size={16} />
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                placeholder="Confirme a senha"
                title="Confirme a senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="text-vscode-accent hover:text-vscode-text-muted focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                title={showConfirm ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow mt-2 text-center">
            <span className="flex items-center gap-2 mx-auto"><UserIcon size={18} /> Cadastrar</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold text-vscode-accent border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow mt-2 text-center"
            onClick={fillWithFake}
          >
            Preencher com dados fake
          </button>
          <button type="button" className="flex items-center justify-center text-xs text-vscode-accent mt-1 underline text-center" onClick={() => navigate('/')}>Já tem conta? Entrar</button>
        </form>
      </div>
    </MatrixLayout>
  );
};

export default Signup;
