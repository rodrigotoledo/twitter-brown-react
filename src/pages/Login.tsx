import { KeyRound, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatrixLayout from "../components/MatrixLayout";
import { useUser } from "../context/UserContext";
import { API_URL } from "../lib/api";

const Login = () => {
  const { user, login } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !username) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Authentication error.");
        return;
      }
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.dispatchEvent(new CustomEvent("tokenSet"));
      }
      login({
        name: data.name || name,
        email: data.email || email,
        username: data.username || username,
      });
    } catch {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <MatrixLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-sm space-y-4 rounded-2xl border border-vscode-border bg-vscode-sidebar p-8 shadow-xl shadow-black/40"
        >
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Sign In
          </h1>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-vscode-border bg-vscode-input p-3 text-vscode-text outline-none placeholder-vscode-text-muted focus:border-vscode-accent focus:ring-1 focus:ring-vscode-accent/30"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-vscode-border bg-vscode-input p-3 text-vscode-text outline-none placeholder-vscode-text-muted focus:border-vscode-accent focus:ring-1 focus:ring-vscode-accent/30"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-vscode-border bg-vscode-input p-3 text-vscode-text outline-none placeholder-vscode-text-muted focus:border-vscode-accent focus:ring-1 focus:ring-vscode-accent/30"
          />

          {error && (
            <div className="text-sm text-red-400" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-vscode-accent py-3 text-center text-sm font-bold text-vscode-accent-ink transition hover:bg-vscode-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/50"
          >
            <KeyRound size={18} aria-hidden />
            Sign In
          </button>
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-vscode-border py-2.5 text-center text-sm font-semibold text-vscode-text transition hover:bg-vscode-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/30"
            onClick={() => navigate("/signup")}
          >
            <UserPlus size={18} aria-hidden />
            Create account
          </button>
          <button
            type="button"
            className="mt-1 w-full text-center text-xs text-vscode-text-muted underline decoration-vscode-border underline-offset-2 transition hover:text-vscode-accent"
            onClick={() => navigate("/forgot")}
          >
            Forgot password
          </button>
        </form>
      </div>
    </MatrixLayout>
  );
};

export default Login;
