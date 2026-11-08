import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vertex, fragment } from './ribbon.shaders'
import { isLowPower } from './motion'

function Lines({ accent }: { accent: [string, string] }) {
  const low = isLowPower()
  const rows = low ? 38 : 96
  const cols = low ? 90 : 220
  const geometry = useMemo(() => {
    const pos = new Float32Array((rows + 1) * (cols + 1) * 3)
    const idx: number[] = []
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const i = (r * (cols + 1) + c) * 3
        pos[i] = (c / cols - 0.5) * 12
        pos[i + 1] = (r / rows - 0.5) * 6
        pos[i + 2] = 0
        if (c < cols) idx.push(r * (cols + 1) + c, r * (cols + 1) + c + 1)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setIndex(idx)
    return g
  }, [rows, cols])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uA: { value: new THREE.Color(accent[0]) },
      uB: { value: new THREE.Color(accent[1]) },
      uC: { value: new THREE.Color('#9FB8FF') },
    }),
    [accent],
  )
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock, pointer }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uMouse.value.lerp(pointer, 0.05)
    if (group.current) {
      group.current.rotation.y = uniforms.uMouse.value.x * 0.18
      group.current.rotation.x = -0.35 + uniforms.uMouse.value.y * 0.1
    }
  })
  return (
    <group ref={group} rotation={[-0.35, 0, 0.12]}>
      <lineSegments geometry={geometry}>
        <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms}
          transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  )
}

export default function RibbonScene({ accent = ['#C9A7E8', '#F2A7C8'] as [string, string] }) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [tabOn, setTabOn] = useState(true)
  useEffect(() => {
    const el = host.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    const vis = () => setTabOn(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', vis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [])
  return (
    <div ref={host} data-testid="ribbon-webgl" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <Canvas frameloop={visible && tabOn ? 'always' : 'never'} dpr={isLowPower() ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 50 }} gl={{ antialias: !isLowPower(), alpha: true, powerPreference: 'high-performance' }}>
        <Lines accent={accent} />
      </Canvas>
    </div>
  )
}
