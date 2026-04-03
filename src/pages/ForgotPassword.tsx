import { useState } from "react";
import { Mail, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MatrixLayout from "../components/MatrixLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      setMessage("");
      return;
    }
    // Simula busca de usuário
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      setError("Email not found.");
      setMessage("");
      return;
    }
    setError("");
    setMessage(
      "If this email is registered, you will receive instructions to reset your password. (Simulation)",
    );
  };

  return (
    <MatrixLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-vscode-border bg-vscode-sidebar p-8 shadow-xl shadow-black/40"
        >
          <h2 className="text-xl font-bold text-vscode-text mb-2 flex items-center gap-2">
            <KeyRound size={22} /> Forgot password
          </h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-vscode-border bg-vscode-input px-3 py-0.5 transition focus-within:border-vscode-accent focus-within:ring-1 focus-within:ring-vscode-accent/30">
              <Mail size={16} />
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 p-2 outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-400" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="text-sm text-vscode-accent">{message}</div>
          )}
          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-vscode-accent px-4 py-2.5 text-center text-sm font-bold text-vscode-accent-ink transition hover:bg-vscode-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/50"
          >
            <KeyRound size={18} aria-hidden />
            Send instructions
          </button>
          <button
            type="button"
            className="mt-1 text-center text-xs text-vscode-text-muted underline decoration-vscode-border underline-offset-2 transition hover:text-vscode-accent"
            onClick={() => navigate("/")}
          >
            Back to login
          </button>
        </form>
      </div>
    </MatrixLayout>
  );
};

export default ForgotPassword;
