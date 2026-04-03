import { useUser } from "../context/UserContext";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  const { user, logout } = useUser();

  if (!user) return null;

  return (
    <header className="flex w-full max-w-7xl items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-vscode-text">{user.name}</h1>
        <p className="text-sm text-vscode-text-muted">@{user.username}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-vscode-accent text-sm underline transition hover:text-vscode-accent-hover"
          title="Go to home"
        >
          Home
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-vscode-border bg-transparent px-4 py-2 text-sm font-semibold text-vscode-text transition hover:bg-vscode-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/50"
          title="Logout"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
