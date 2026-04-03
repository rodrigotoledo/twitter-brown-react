import { faker } from "@faker-js/faker";
import { Eye, EyeOff, KeyRound, Mail, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MatrixLayout from "../components/MatrixLayout";
import { useUser } from "../context/UserContext";
import { API_URL } from "../lib/api";

const Signup = () => {
  const { login } = useUser();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirmPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Registration error.");
        return;
      }
      // Sucesso: loga automaticamente
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.dispatchEvent(new CustomEvent("tokenSet"));
      }
      login({
        name: data.name || form.name,
        username: data.username || form.username,
        email: data.email || form.email,
      });
    } catch {
      setError("Connection error. Please try again.");
    }
  };

  const fillWithFake = () => {
    setForm({
      name: faker.person.fullName(),
      username: faker.internet.username().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: "Senha123!",
      confirmPassword: "Senha123!",
    });
    setError("");
  };

  return (
    <MatrixLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-vscode-border bg-vscode-sidebar p-8 shadow-xl shadow-black/40"
        >
          <h2 className="text-xl font-bold text-vscode-text mb-2 flex items-center gap-2">
            <UserIcon size={22} /> Create account
          </h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Name</label>
            <div className="flex items-center gap-2 rounded-xl border border-vscode-border bg-vscode-input px-3 py-0.5 transition focus-within:border-vscode-accent focus-within:ring-1 focus-within:ring-vscode-accent/30">
              <UserIcon size={16} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                autoComplete="name"
                placeholder="Full name"
                title="Full name"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Username</label>
            <div className="flex items-center gap-2 rounded-xl border border-vscode-border bg-vscode-input px-3 py-0.5 transition focus-within:border-vscode-accent focus-within:ring-1 focus-within:ring-vscode-accent/30">
              <UserIcon size={16} />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                autoComplete="username"
                placeholder="Your username"
                title="Your username"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-vscode-border bg-vscode-input px-3 py-0.5 transition focus-within:border-vscode-accent focus-within:ring-1 focus-within:ring-vscode-accent/30">
              <Mail size={16} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                autoComplete="email"
                placeholder="Your email"
                title="Your email"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-vscode-border bg-vscode-input px-3 py-0.5 transition focus-within:border-vscode-accent focus-within:ring-1 focus-within:ring-vscode-accent/30">
              <KeyRound size={16} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                placeholder="Password"
                title="Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="text-vscode-accent hover:text-vscode-text-muted focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-vscode-text-muted">
              Confirm password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-vscode-border bg-vscode-input px-3 py-0.5 transition focus-within:border-vscode-accent focus-within:ring-1 focus-within:ring-vscode-accent/30">
              <KeyRound size={16} />
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                className="bg-transparent flex-1 p-2 outline-none autofill:bg-vscode-input!"
                placeholder="Confirm password"
                title="Confirm password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="text-vscode-accent hover:text-vscode-text-muted focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                title={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-400" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-vscode-accent px-4 py-2.5 text-center text-sm font-bold text-vscode-accent-ink transition hover:bg-vscode-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/50"
          >
            <UserIcon size={18} aria-hidden />
            Register
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-vscode-border px-4 py-2 text-center text-sm font-semibold text-vscode-text transition hover:bg-vscode-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/30"
            onClick={fillWithFake}
          >
            Fill with fake data
          </button>
          <button
            type="button"
            className="mt-1 text-center text-xs text-vscode-text-muted underline decoration-vscode-border underline-offset-2 transition hover:text-vscode-accent"
            onClick={() => navigate("/")}
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </MatrixLayout>
  );
};

export default Signup;
