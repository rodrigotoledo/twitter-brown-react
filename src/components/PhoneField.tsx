import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

type Props = {
  id?: string
  label?: string
  defaultCountry?: string
  value: string
  onChange: (phone: string) => void
}

const PhoneField = ({
  id = 'phone',
  label = 'Phone number',
  defaultCountry = 'BR',
  value,
  onChange,
}: Props) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-cursor-muted">
      {label}
    </label>
    <div className="phone-input">
      <PhoneInput
        inputProps={{ id, name: id }}
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
)

export default PhoneField
