import { useId, useState } from 'react'

interface Props { label: string; value: string; onChange(v: string): void; autoComplete: 'current-password' | 'new-password'; required?: boolean }

/** Campo de senha com botão "Mostrar/Ocultar" para a pessoa conferir o que digitou. */
export default function PasswordField({ label, value, onChange, autoComplete, required }: Props) {
  const id = useId()
  const [show, setShow] = useState(false)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pwd">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="pwd__toggle" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? 'Ocultar' : 'Mostrar'}</button>
      </div>
    </div>
  )
}
