import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { Toast, ToastToggle } from 'flowbite-react'
import { cursorToastTheme } from '../components/toastTheme'
import {
  ToastErrorIcon,
  ToastInfoIcon,
  ToastSuccessIcon,
  ToastWarningIcon,
} from '../components/ToastIcons'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastItem = {
  id: string
  type: ToastType
  message: string
}

type ShowToastOptions = {
  type?: ToastType
  message: string
  duration?: number
}

type ToastApi = {
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

type ToastContextType = {
  showToast: (options: ShowToastOptions) => void
  toast: ToastApi
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const renderToastIcon = (type: ToastType) => {
  const base =
    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'

  switch (type) {
    case 'success':
      return (
        <div className={`${base} bg-green-400/15 text-green-400`}>
          <ToastSuccessIcon />
        </div>
      )
    case 'error':
      return (
        <div className={`${base} bg-red-400/15 text-red-400`}>
          <ToastErrorIcon />
        </div>
      )
    case 'warning':
      return (
        <div className={`${base} bg-amber-400/15 text-amber-400`}>
          <ToastWarningIcon />
        </div>
      )
    default:
      return (
        <div className={`${base} bg-cursor-accent/15 text-cursor-accent`}>
          <ToastInfoIcon />
        </div>
      )
  }
}

const ToastStack = ({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) => (
  <div
    className="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
  >
    {toasts.map(({ id, type, message }) => (
        <Toast key={id} theme={cursorToastTheme} className="pointer-events-auto">
          {renderToastIcon(type)}
          <div className="ml-3 text-sm font-normal">{message}</div>
          <ToastToggle onDismiss={() => onDismiss(id)} />
        </Toast>
    ))}
  </div>
)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'info', message, duration = 5000 }: ShowToastOptions) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, type, message }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss]
  )

  const toast: ToastApi = {
    success: (message, duration) => showToast({ type: 'success', message, duration }),
    error: (message, duration) => showToast({ type: 'error', message, duration }),
    warning: (message, duration) => showToast({ type: 'warning', message, duration }),
    info: (message, duration) => showToast({ type: 'info', message, duration }),
  }

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
