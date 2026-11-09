import { Fragment } from 'react'

/** Título revelado palavra por palavra (máscara). */
export default function SplitWords({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`sw ${className}`}>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="sw__mask" aria-hidden="true">
            <span className="sw__word" style={{ ['--d' as string]: `${delay + i * 90}ms` }}>{w}</span>
          </span>{' '}
        </Fragment>
      ))}
    </span>
  )
}
