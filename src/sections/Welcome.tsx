//libraries
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from 'react'
import { Vector3 } from 'three'
// modules
import BorderedPlane from "../components/BorderedPlane"

const Welcome = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height } = viewport.getCurrentViewport()
  const r_text = useRef<HTMLHeadingElement>(null!)
  const r_wrapper = useRef<THREE.Group>(null!)

  useFrame(() => {
    const sectionOffset = scrollData.range(0.05, 0.1675)
    r_wrapper.current.position.x = (-width * 3.35 * sectionOffset) + (width * 1.675)

    const fontWeightFactor = scrollData.range(0.06, 0.12)
    if (r_text.current && fontWeightFactor > 0) r_text.current.style.fontWeight = `${fontWeightFactor * 700 + 100}`
  })
  return <BorderedPlane
    width={width * 2.35}
    height={height + 2/viewport.factor}
    factor={viewport.factor}
    position={new Vector3(1.75 * height + width * 0.5, 0, 0)}
    groupRef={r_wrapper}
  >
    <Html
      // center
      transform
      distanceFactor={3.4}
      zIndexRange={[0, 100]}
      wrapperClass="welcome"
      portal={{ current: scrollData.fixed }}
    >
      <h1 ref={r_text}>WELCOME</h1>
    </Html>
  </BorderedPlane>
}

export default Welcome
