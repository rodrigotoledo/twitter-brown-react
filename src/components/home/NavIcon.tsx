import type { ReactNode } from 'react'

type Props = {
  label: string
  active?: boolean
  children: ReactNode
  onClick?: () => void
}

const NavIcon = ({ label, active, children, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-4 w-full px-4 py-3 rounded-full text-left transition ${
      active
        ? 'font-bold bg-cursor text-cursor-foreground'
        : 'text-cursor-foreground hover:bg-cursor'
    }`}
  >
    <span className="w-6 h-6 shrink-0">{children}</span>
    <span className="text-lg hidden xl:inline">{label}</span>
  </button>
)

export default NavIcon
