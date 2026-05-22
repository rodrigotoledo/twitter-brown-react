import { type InputHTMLAttributes } from 'react'

const inputClass =
  'w-full border border-cursor-border bg-cursor-light text-cursor-foreground p-3 rounded outline-none focus:outline focus:outline-2 focus:outline-cursor-focus'

type Props = {
  id: string
  label: string
} & InputHTMLAttributes<HTMLInputElement>

const FormField = ({ id, label, className, ...props }: Props) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-cursor-muted">
      {label}
    </label>
    <input
      id={id}
      className={className ? `${inputClass} ${className}` : inputClass}
      {...props}
    />
  </div>
)

export default FormField
