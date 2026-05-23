import { Link } from 'react-router-dom'
import NavIcon from './NavIcon'
import type { User } from '../../context/UserContext'

const iconClass = 'w-6 h-6'
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type Props = {
  user: User | null
  postCount: number
  likeCount: number
  onLogout: () => void
}

const HomeIcon = () => (
  <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 9.4c-4.14 0-7.5 2.69-7.5 6s3.36 6 7.5 6 7.5-2.69 7.5-6-3.36-6-7.5-6zm0 10.5c-2.9 0-5.25-2.02-5.25-4.5S9.1 11 12 11s5.25 2.02 5.25 4.5-2.35 4.5-5.25 4.5z" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
)

const ExploreIcon = () => (
  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
)

const BellIcon = () => (
  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-6-6 6 6 0 00-6 6v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const MailIcon = () => (
  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const UserIcon = () => (
  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const getAvatarUrl = (avatarUrl?: string) => {
  if (!avatarUrl) return ''
  return avatarUrl.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`
}

const LeftNav = ({ user, postCount, likeCount, onLogout }: Props) => (
  <aside className="hidden lg:flex fixed left-0 top-0 z-20 h-screen flex-col w-20 xl:w-64 px-2 xl:px-4 py-4 border-r border-cursor-border bg-cursor-light">
    <Link to="/home" className="mb-6 px-3" aria-label="Home">
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-cursor-foreground" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </Link>

    <nav className="flex flex-col gap-1 flex-1">
      <NavIcon label="Home" active>
        <HomeIcon />
      </NavIcon>
      <NavIcon label="Explore">
        <ExploreIcon />
      </NavIcon>
      <NavIcon label="Notifications">
        <BellIcon />
      </NavIcon>
      <NavIcon label="Messages">
        <MailIcon />
      </NavIcon>
      <NavIcon label="Profile">
        <UserIcon />
      </NavIcon>
    </nav>

    {user && (
      <section className="mt-4 rounded-lg border border-cursor-border bg-cursor-dark p-2 xl:p-3">
        <div className="flex flex-col items-center gap-2 xl:flex-row xl:gap-3 min-w-0">
          {user.avatar_url ? (
            <img
              src={getAvatarUrl(user.avatar_url)}
              alt=""
              className="h-12 w-12 rounded-full object-cover bg-cursor-light"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cursor-light text-lg font-bold">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="hidden min-w-0 xl:block">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-sm text-cursor-muted">@{user.username}</p>
          </div>
        </div>

        <p className="mt-2 truncate text-center text-xs font-semibold xl:hidden">
          @{user.username}
        </p>

        <dl className="mt-3 grid grid-cols-1 gap-2 text-center text-xs xl:grid-cols-2 xl:text-left xl:text-sm">
          <div className="rounded bg-cursor-light px-1.5 py-1 xl:bg-transparent xl:p-0">
            <dt className="text-cursor-muted">Posts</dt>
            <dd className="font-semibold tabular-nums">{postCount}</dd>
          </div>
          <div className="rounded bg-cursor-light px-1.5 py-1 xl:bg-transparent xl:p-0">
            <dt className="text-cursor-muted">Likes</dt>
            <dd className="font-semibold tabular-nums">{likeCount}</dd>
          </div>
        </dl>
      </section>
    )}

    {user ? (
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-cursor-accent text-cursor-on-accent font-bold transition hover:bg-cursor-accent-hover xl:h-auto xl:w-full xl:py-3"
        aria-label="Log out"
      >
        <span className="xl:hidden" aria-hidden>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m8-8l4 4-4 4m4 4l-4 4" />
          </svg>
        </span>
        <span className="hidden xl:inline">Log out</span>
      </button>
    ) : (
      <Link
        to="/signin"
        className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-cursor-accent text-cursor-on-accent font-bold transition hover:bg-cursor-accent-hover xl:h-auto xl:w-full xl:py-3"
        aria-label="Sign in"
      >
        <span className="xl:hidden" aria-hidden>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
        </span>
        <span className="hidden xl:inline">Sign in</span>
      </Link>
    )}
  </aside>
)

export default LeftNav
