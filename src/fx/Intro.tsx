import { useEffect, useRef, useState } from 'react'
import Monogram from '../brand/Monogram'
import { SLOGAN } from '../brand/brands'
import NeonFrames from './NeonFrames'
import { prefersReducedMotion } from './motion'

const KEY = 'ul-intro'
const seen = (): boolean => {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}
const markSeen = () => {
  try { sessionStorage.setItem(KEY, '1') } catch { /* storage bloqueado: ok */ }
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const [skip] = useState(() => prefersReducedMotion() || seen())
  const finished = useRef(false)
  const finish = () => {
    if (finished.current) return
    finished.current = true
    markSeen()
    onDone()
  }
  useEffect(() => {
    if (skip) { finish(); return }
    const t = setTimeout(finish, 4600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (skip) return null
  return (
    <div className="intro" data-testid="intro" role="dialog" aria-label="Universo Lay">
      <div className="intro__stage">
        <NeonFrames from="#9FB8FF" to="#F2A7C8" layers={6} />
        <div className="intro__mark"><Monogram variant="light" size={150} /></div>
        <p className="intro__slogan" aria-label={SLOGAN}>
          {SLOGAN.split('').map((ch, n) => (
            <span key={n} style={{ ['--n' as string]: n }} aria-hidden>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </p>
      </div>
      <button className="intro__skip" onClick={finish}>Pular</button>
    </div>
  )
}
