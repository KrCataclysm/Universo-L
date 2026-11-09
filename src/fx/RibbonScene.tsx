import { useEffect, useRef, useState } from 'react'
import { isLowPower } from './motion'
import RibbonFallback from './RibbonFallback'
import { startRibbon } from './ribbonGL'

export default function RibbonScene({ accent = ['#C9A7E8', '#F2A7C8'] as [string, string] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const c = ref.current
    if (!c || failed) return
    return startRibbon(c, { accent, low: isLowPower(), onFail: () => setFailed(true) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accent[0], accent[1], failed])
  if (failed) return <RibbonFallback accent={accent} />
  return <canvas ref={ref} data-testid="ribbon-webgl" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
