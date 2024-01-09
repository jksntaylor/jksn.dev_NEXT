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
  const { width, height, factor } = viewport.getCurrentViewport()
  const r_text = useRef<HTMLHeadingElement>(null!)
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_definition = useRef<HTMLDivElement>(null!)

  useFrame(() => {
    const sectionOffset = scrollData.range(0.05, 0.183)
    const fontWeightFactor = scrollData.range(0.06, 0.12)

    if (sectionOffset === 0 && r_wrapper.current.position.x !== width * 1.675) {
      r_wrapper.current.position.x = width * 1.675
    } else if (sectionOffset === 1 && r_wrapper.current.position.x !== -width * 1.675) {
      r_wrapper.current.position.x = -width * 1.675
    } else {
      r_wrapper.current.position.x = (-width * 3.35 * sectionOffset) + (width * 1.675) // 1.675 = 2.35/2 + 0.5
      if (r_definition.current) r_definition.current.style.left = `${60 * sectionOffset + 20}%`
      if (r_text.current && fontWeightFactor > 0) {
        r_text.current.style.fontWeight = `${fontWeightFactor * 700 + 100}`
      }
    }

  })
  return <BorderedPlane
    width={width * 2.35}
    height={height + 2/factor}
    factor={factor}
    position={new Vector3(width * 1.675, 0, 0.0002)}
    groupRef={r_wrapper}
  >
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[3, 4]}
      wrapperClass="welcome"
      portal={{ current: scrollData.fixed }}
    >
      <h1 ref={r_text}>WELCOME</h1>
      <div ref={r_definition} className="welcome_definition">
        <span>C<em>R</em>E•<em>A</em>•TI<em>V</em>E <em>D</em>E•V<em>EL</em>•O<em>P</em>•E<em>R</em></span>
        <span>(noun)</span>
        <h4>A frontend dev who specializes in interactive animation and 3D for the web</h4>
        <h5>See also: someone who has a knack<br/>for making laptops overheat</h5>
      </div>
    </Html>
  </BorderedPlane>
}

export default Welcome
