//libraries
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from 'react'
import { useMedia } from "../utils/hooks"
import { Vector3 } from 'three'
// assets
import '../styles/Welcome.scss'

const Welcome = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { height, width, factor } = viewport.getCurrentViewport()
  const r_text = useRef<HTMLHeadingElement>(null!)
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_content = useRef<HTMLDivElement>(null!)

  const wrapperOffset = useMedia(-width * 3.36, -width * 3.35, 0)

  useFrame(() => {
    const wrapperRange = scrollData.range(0.05, 0.183)
    const fontWeightRange = scrollData.range(0.06, 0.12)

    if (wrapperRange === 0 && r_wrapper.current.position.x !== width * 1.675) {
      r_wrapper.current.position.x = width * 1.675
    } else if (wrapperRange === 1 && r_wrapper.current.position.x !== -width * 1.675) {
      r_wrapper.current.position.x = -width * 1.675
    } else {
      r_wrapper.current.position.x = wrapperOffset * wrapperRange + width * 1.675 // 1.675 = 2.35/2 + 0.5
      if (r_content.current) r_content.current.style.left = `${60 * wrapperRange + 20}%`
      if (r_text.current && fontWeightRange > 0) r_text.current.style.fontWeight = `${fontWeightRange * 700 + 200}`
    }

  })
  return <group
    position={new Vector3(width * 1.675, 0, 0.0002)}
    ref={r_wrapper}
  >
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[4, 5]}
      wrapperClass="welcome"
      portal={{ current: scrollData.fixed }}
      style={{ height: height * factor }}
    >
      <h1 ref={r_text} style={{ transform: useMedia(`scaleY(${(window.innerHeight / window.innerWidth) * 1.6})`, 'none', 'none')}}>WELCOME</h1>
      <div ref={r_content} className="welcome_content">
        <div className='section_number' style={{
          width: useMedia(height * 0.08, width * 0.046, 0) * factor,
          height: useMedia(height * 0.08, width * 0.046, 0) * factor
        }}>01</div>
        <div className="welcome_definition">
          <span>C<em>R</em>E•<em>A</em>•TI<em>V</em>E <em>D</em>E•V<em>EL</em>•O<em>P</em>•E<em>R</em></span>
          <span>(noun)</span>
          <p>A frontend dev who specializes in interactive animation and 3D for the web</p>
          <p>See also: someone who has a knack<br/>for making laptops overheat</p>
        </div>
      </div>
    </Html>
  </group>
}

export default Welcome
