// libraries
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { Html, PerspectiveCamera, RenderTexture, Text, useScroll } from "@react-three/drei"
import { Vector2, Vector3 } from 'three'
import { useRef } from "react"
// modules
import { t_landingMaterial } from "../components/Materials.ts"
import { colors } from "../utils/constants.ts"
import { lerp } from "../utils/functions.tsx"
// assets
import LandingArrow from '../assets/images/landing-arrow.tsx'
import gsap from "gsap"

const Landing = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  // distorted text material
  const r_material = useRef<t_landingMaterial>(null!)
  const r_mouse = useRef({ target: new Vector2(2, 2), current: new Vector2(2, 2) })
  // wrapper ref
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_arrow = useRef<THREE.Group>(null!)
  const r_arrowInner = useRef<SVGGElement>(null!)
  // distorted text lines
  const r_text1 = useRef<typeof Text>(null!)
  const r_text2 = useRef<typeof Text>(null!)
  const r_text3 = useRef<typeof Text>(null!)
  // "lets build something new" slices
  const r_slice1 = useRef<HTMLDivElement>(null!)
  const r_slice2 = useRef<HTMLDivElement>(null!)
  const r_slice3 = useRef<HTMLDivElement>(null!)
  const r_slices = [r_slice1, r_slice2, r_slice3]

  const textOptions: {
    fillOpacity: number
    color: string
    lineHeight: number
    letterSpacing: number
    maxWidth: number
    font: string
    scale: Vector3
    anchorX: "left"
    anchorY: "bottom"
  } = {
    fillOpacity: 1,
    color: colors.dirtyWhite,
    lineHeight: 1,
    letterSpacing: 0,
    maxWidth: 12,
    font: '/fonts/NeueMontreal400.woff',
    scale: new Vector3(width / 12.5, width / 12, 1),
    anchorX: 'left',
    anchorY: 'bottom'
  }

  const renderText = () => <>
    <Text ref={r_text1} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 12) * 2 + 0.1, 0]}>HEY, I'M JACKSON TAYLOR</Text>
    <Text ref={r_text2} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 12) + 0.1, 0]}>A CREATIVE DEVELOPER</Text>
    <Text ref={r_text3} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + 0.1, 0]}>BASED IN SALT LAKE CITY</Text>
  </>

  useFrame((_s, delta) => {
    const sliceOffset = scrollData.range(0, 0.05)
    const sectionOffset = scrollData.range(0.05, 0.05)

    if (sliceOffset === 0) {
      r_material.current.u_time += delta
      if (r_wrapper.current.position.x !== 0) r_wrapper.current.position.x = 0
    } else if (sliceOffset > 0 && sectionOffset < 1) {
      r_slices.forEach((r_slice, i) => r_slice.current.style.transform = `translateX(${(1 - sliceOffset) * (120 + 60 * i)}%)`)
      r_wrapper.current.position.x = -width * 0.915 * sectionOffset
      r_material.current.u_time += delta

      r_arrowInner.current.style.transform = `scale(${Math.min(sliceOffset + 1, 1.4)}) `
      if (r_arrowInner.current.parentElement) r_arrowInner.current.parentElement.style.transform = `rotate(${-360 * sliceOffset}deg)`

      r_arrow.current.position.x = width / 2 - width * 0.065 - width * 0.05 * sliceOffset
      r_arrow.current.position.y = height/2 - width * 0.065 - height * 0.7 * sliceOffset
      r_arrow.current.scale.set(sliceOffset * .5 + 1, sliceOffset *  .5 + 1, 1)
    } else if (sectionOffset === 1) {
      if (r_wrapper.current.position.x !== -width * 0.915) r_wrapper.current.position.x = -width * 0.915
      if (r_slices[0].current.style.transform !== `translateX(0%)`) {
        r_slices.forEach(slice => slice.current.style.transform = `translateX(0%)`)
      }
    }

    if (r_mouse.current.target.distanceTo(r_mouse.current.current) > 0.01) {
      const mouseX = lerp(r_mouse.current.current.x, r_mouse.current.target.x, 0.06)
      const mouseY = lerp(r_mouse.current.current.y, r_mouse.current.target.y, 0.06)
      r_material.current.u_mouse.set(mouseX, mouseY)
      r_mouse.current.current.set(mouseX, mouseY)
    }
  })

  const handlePointerEnter = () => gsap.to(r_material.current, { u_mouse_rad: 0.2, duration: 0.85 })

  const handlePointerLeave = () => gsap.to(r_material.current, { u_mouse_rad: 0, duration: 0.85 })

  const handlePointer = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) r_mouse.current.target.set(e.uv?.x, e.uv.y)
  }

  return <group ref={r_wrapper}>
    <mesh
      position={[width * 0.0425, 0, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={e => handlePointer(e)}
    >
      <planeGeometry args={[width * 0.915, height, 64, 64]} />
      <landingMaterial ref={r_material} u_mouse={new Vector2(2, 2)} u_mouse_rad={0} u_aspect={width / height}>
        <RenderTexture attach="u_texture">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <color attach="background" args={[colors.fadedBlack]} />
          {renderText()}
        </RenderTexture>
      </landingMaterial>
    </mesh>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      style={{ width: width * 0.915 * factor - 2, height: height * factor }}
      position={[width * 0.0425 + 1/factor, 0, 0.001]}
      wrapperClass="landing_content"
      portal={{ current: scrollData.fixed }}
      zIndexRange={[2, 3]}
    >
      <div ref={r_slice1} className="landing_slice" style={{ transform: `translateX(120%)`}}>
        <h3>L<em>E</em>T'S B<em>U</em>ILD</h3>
      </div>
      <div ref={r_slice2} className="landing_slice" style={{ transform: `translateX(180%)`}}>
        <h3><em>S</em>O<em>MET</em>HI<em>NG</em></h3>
      </div>
      <div ref={r_slice3} className="landing_slice" style={{ transform: `translateX(240%)`}}>
        <h3>NE<em>W</em></h3>
      </div>
    </Html>
    <group ref={r_arrow} position={[width / 2 - width * 0.065, height/2 - width * 0.065, 0]}>
      <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[5, 6]}
      wrapperClass="landing_arrow"
      portal={{ current: scrollData.fixed }}
      style={{ width: width * 0.097 * factor, height: width * 0.097 * factor}}
      >
        <LandingArrow innerRef={r_arrowInner}/>
      </Html>
    </group>
  </group>
}

export default Landing
