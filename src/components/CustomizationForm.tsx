import type { CustomField } from '../data/catalog'

export default function CustomizationForm({ fields, values, errors, onChange }: { fields: CustomField[]; values: Record<string, string>; errors: Record<string, string>; onChange: (key: string, v: string) => void }) {
  if (!fields.length) return null
  return (
    <fieldset className="custom">
      <legend>Personalização</legend>
      {fields.map((f) => (
        <label key={f.key} className="field">
          <span>{f.label}{f.required && <b aria-hidden> *</b>}</span>
          {f.type === 'select' ? (
            <select value={values[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)} aria-invalid={!!errors[f.key]} required={f.required}>
              <option value="">Escolha…</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input value={values[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)} maxLength={120} aria-invalid={!!errors[f.key]} required={f.required} />
          )}
          {errors[f.key] && <em role="alert">{errors[f.key]}</em>}
        </label>
      ))}
    </fieldset>
  )
}
