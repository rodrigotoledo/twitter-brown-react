import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const navLinkClass = (active: boolean) =>
  `px-4 py-2 rounded-full font-semibold text-sm transition ${
    active
      ? 'bg-cursor-foreground text-cursor-dark'
      : 'border border-cursor-border text-cursor-foreground hover:bg-cursor'
  }`

const AuthLayout = ({ children }: Props) => {
  const { pathname } = useLocation()
  const isSignIn = pathname === '/signin' || pathname === '/forgot-password'
  const isSignUp = pathname === '/signup'

  return (
    <div className="min-h-screen flex flex-col bg-cursor-light text-cursor-foreground">
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/signin" className="flex items-center" aria-label="Home">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-cursor-foreground" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/signin" className={navLinkClass(isSignIn)}>
            Sign in
          </Link>
          <Link to="/signup" className={navLinkClass(isSignUp)}>
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  )
}

export default AuthLayout
