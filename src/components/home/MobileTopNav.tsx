import type { User } from '../../context/UserContext'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type Props = {
  user: User | null
  postCount: number
  likeCount: number
  onLogout: () => void
}

const getAvatarUrl = (avatarUrl?: string) => {
  if (!avatarUrl) return ''
  return avatarUrl.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`
}

const MobileTopNav = ({ user, postCount, likeCount, onLogout }: Props) => (
  <header className="fixed inset-x-0 top-0 z-30 border-b border-cursor-border bg-cursor-light/95 px-3 py-2 backdrop-blur lg:hidden">
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {user?.avatar_url ? (
          <img
            src={getAvatarUrl(user.avatar_url)}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover bg-cursor-dark"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cursor-dark text-base font-bold">
            {(user?.username || '?').slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {user ? `@${user.username}` : 'Home'}
          </p>
          <p className="truncate text-xs text-cursor-muted">
            {postCount} posts · {likeCount} likes
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="shrink-0 rounded-full bg-cursor-accent px-4 py-2 text-sm font-bold text-cursor-on-accent transition hover:bg-cursor-accent-hover"
      >
        Log out
      </button>
    </div>

    <nav className="mt-2 grid grid-cols-4 gap-1 text-xs font-semibold text-cursor-muted">
      <button type="button" className="rounded-full bg-cursor px-2 py-2 text-cursor-foreground">
        Home
      </button>
      <button type="button" className="rounded-full px-2 py-2 hover:bg-cursor">
        Explore
      </button>
      <button type="button" className="rounded-full px-2 py-2 hover:bg-cursor">
        Alerts
      </button>
      <button type="button" className="rounded-full px-2 py-2 hover:bg-cursor">
        Profile
      </button>
    </nav>
  </header>
)

export default MobileTopNav
