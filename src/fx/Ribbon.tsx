import { lazy, Suspense } from 'react'
import { hasWebGL, prefersReducedMotion } from './motion'
import RibbonFallback from './RibbonFallback'

const RibbonScene = lazy(() => import('./RibbonScene'))

export default function Ribbon({ accent }: { accent?: [string, string] }) {
  if (prefersReducedMotion() || !hasWebGL()) return <RibbonFallback accent={accent} />
  return (
    <Suspense fallback={<RibbonFallback accent={accent} />}>
      <RibbonScene accent={accent} />
    </Suspense>
  )
}
