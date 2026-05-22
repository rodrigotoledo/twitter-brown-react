import type { ToastTheme } from 'flowbite-react'

export const cursorToastTheme = {
  root: {
    base: 'flex w-full max-w-sm items-center rounded-lg border border-cursor-border bg-cursor-dark p-4 text-cursor-foreground shadow-lg',
    closed: 'opacity-0 ease-out',
  },
  toggle: {
    base: '-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-cursor-dark p-1.5 text-cursor-muted hover:bg-cursor hover:text-cursor-foreground focus:outline-none focus:ring-2 focus:ring-cursor-focus',
    icon: 'h-5 w-5 shrink-0',
  },
} as ToastTheme
