import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import type { BorealisMaterialUniformsType } from './borealisMaterial'
import './borealisMaterial'
import { Vector2 } from 'three'
import { lerp } from 'three/src/math/MathUtils.js'
import { useScroll } from '@react-three/drei'
import { useMedia } from '../../utils/hooks'

const Borealis: React.FC<{}> = () => {

  const scrollData = useScroll()
  const materialRef = useRef<BorealisMaterialUniformsType>(null)
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  const mouse = useRef({ current: new Vector2(0, 0), target: new Vector2(0, 0)})
  
  useFrame((_state, delta) => {
    const activeRange = scrollData.range(0.85, 0.725)
    if (activeRange === 0) return
    if (mouse.current.target !== mouse.current.current) {
      mouse.current.current.set(
        lerp(mouse.current.current.x, mouse.current.target.x, 0.01),
        lerp(mouse.current.current.y, mouse.current.target.y, 0.01)
      )
    }
    if (!materialRef.current) return;
    materialRef.current.elapsedTime += delta;
    materialRef.current.mousePosition = mouse.current.current
  })

  const onMouseMove = (e: MouseEvent) => {
    mouse.current.target.set(e.clientX, e.clientY)
  }

  useEffect(() => {
    window.addEventListener('mousemove', (e) => onMouseMove(e))
    return () => {
      window.removeEventListener('mousemove', (e) => onMouseMove(e))
    }
  }, [])

  return <mesh position={[0, 0, 0]}>
    <planeGeometry args={[useMedia(width - height * 0.16, width * 0.915, width), height, 4, 4]}/>
    <borealisMaterial ref={materialRef}/>
  </mesh>
}

export default Borealis