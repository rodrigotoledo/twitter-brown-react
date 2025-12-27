import { useState } from 'react';
import { Mail, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Informe seu e-mail.');
      setMessage('');
      return;
    }
    // Simula busca de usuário
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      setError('E-mail não encontrado.');
      setMessage('');
      return;
    }
    setError('');
    setMessage('Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha. (Simulação)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vscode-bg">
      <form onSubmit={handleSubmit} className="bg-vscode-sidebar p-8 rounded shadow-lg border border-vscode-border w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold text-vscode-text mb-2 flex items-center gap-2">
          <KeyRound size={22} /> Esqueci a senha
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-vscode-text-muted">E-mail</label>
          <div className="flex items-center gap-2 bg-vscode-input border border-vscode-border rounded px-2">
            <Mail size={16} />
            <input
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-transparent flex-1 p-2 outline-none"
              placeholder="Digite seu e-mail"
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-500 text-sm">{message}</div>}
        <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold text-vscode-text bg-vscode-sidebar border border-vscode-border hover:bg-vscode-hover focus:outline-none focus:border-vscode-border transition shadow mt-2 text-center">
          <span className="flex items-center gap-2 mx-auto"><KeyRound size={18} /> Enviar instruções</span>
        </button>
        <button type="button" className="flex items-center justify-center text-xs text-vscode-accent mt-1 underline text-center" onClick={() => navigate('/')}>Voltar para login</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
