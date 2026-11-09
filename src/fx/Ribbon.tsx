import { hasWebGL, prefersReducedMotion } from './motion'
import RibbonFallback from './RibbonFallback'
import RibbonScene from './RibbonScene'

export default function Ribbon({ accent }: { accent?: [string, string] }) {
  if (prefersReducedMotion() || !hasWebGL()) return <RibbonFallback accent={accent} />
  return <RibbonScene accent={accent} />
}
