// libraries
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { Html, PerspectiveCamera, RenderTexture, Text, useScroll } from "@react-three/drei"
import { useContext, useMemo, useRef } from "react"
import { Group, Vector2, Vector3 } from 'three'
import gsap from "gsap"
// modules
import { t_landingMaterial } from "../components/Materials.ts"
import { ScreenContext } from "../components/Providers.tsx"
import { colors } from "../utils/constants.ts"
import { lerp } from "../utils/functions.tsx"
import { useMedia } from "../utils/hooks.ts"
// assets
import '../styles/Landing.scss'
import LandingArrow from '../assets/svg/landing-arrow.tsx'

const Landing = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  const screen = useContext(ScreenContext)
  // distorted text material
  const r_material = useRef<t_landingMaterial>(null!)
  const r_mouse = useRef({ target: new Vector2(1, 0), current: new Vector2(1, 0) })
  // wrapper ref
  const r_wrapper = useRef<Group>(null!)
  const r_arrow = useRef<Group>(null!)
  const r_arrowInner = useRef<SVGGElement>(null!)
  // distorted text lines
  const r_text1 = useRef<typeof Text>(null!)
  const r_text2 = useRef<typeof Text>(null!)
  const r_text3 = useRef<typeof Text>(null!)
  const r_text4 = useRef<typeof Text>(null!)
  // "lets build something new" slices
  const r_slice1 = useRef<HTMLDivElement>(null!)
  const r_slice2 = useRef<HTMLDivElement>(null!)
  const r_slice3 = useRef<HTMLDivElement>(null!)
  const r_slice4 = useRef<HTMLDivElement>(null!)
  const r_slice5 = useRef<HTMLDivElement>(null!)
  const r_slices = [r_slice1, r_slice2, r_slice3, r_slice4, r_slice5]

  const sectionDistance = useMedia(width - height * 0.16, width * 0.915, width)
  const arrowSize = useMedia(width * 0.097, width * 0.097, width * 0.3)
  const arrowPadding = useMedia(width * 0.065, width * 0.065, width * 0.2)
  const arrowOffset = useMedia([width * 0.05, height * 0.7], [width * 0.05, height * 0.7], [0, height - width * .7])

  useFrame((_s, delta) => {
    const sliceOffset = scrollData.range(0, 0.05)
    const sectionOffset = scrollData.range(0.05, 0.05)

    if (sliceOffset === 0) {
      r_material.current.u_time += delta
      if (r_wrapper.current.position.x !== 0) r_wrapper.current.position.x = 0
    } else if (sliceOffset > 0 && sectionOffset < 1) {
      r_slices.forEach((r_slice, i) => r_slice.current.style.transform = `translateX(${(1 - sliceOffset) * (120 + 60 * i)}%)`)
      r_wrapper.current.position.x = -sectionDistance * sectionOffset
      r_material.current.u_time += delta

      r_arrowInner.current.style.transform = `${screen.mobile ? 'rotate(90deg)' : ''} scale(${Math.min(sliceOffset + 1, 1.4)}) `
      if (r_arrowInner.current.parentElement) r_arrowInner.current.parentElement.style.transform = `rotate(${-360 * sliceOffset}deg)`

      r_arrow.current.position.x = width / 2 - arrowPadding - arrowOffset[0] * sliceOffset
      r_arrow.current.position.y = height/2 - arrowPadding - arrowOffset[1] * sliceOffset
      r_arrow.current.scale.set(sliceOffset * .5 + 1, sliceOffset *  .5 + 1, 1)
    } else if (sectionOffset === 1) {
      if (r_wrapper.current.position.x !== -sectionDistance) r_wrapper.current.position.x = -sectionDistance
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

  const textOpts: {
    anchorX: "left",
    anchorY: "middle"
  } = useMemo(() => {
    return {
      anchorX: "left",
      anchorY: "middle",
      color: colors.dirtyWhite,
      fillOpacity: 1,
      font: '/fonts/NeueMontreal400.woff',
      letterSpacing: 0.04,
      outlineWidth: 0.03,
      outlineColor: colors.dirtyWhite,
      scale: new Vector3(width * 0.065, height * 0.09, 0.75)
    }
  }, [width, height])

  const menuWidth = useMemo(() => {
    return screen.fullWidth ? width * 0.1 : screen.desktop ? width * 0.08 : width
  }, [screen, width])

  const text = useMemo(() => {
    return {
      x: -(width - menuWidth)/2,
      y: height / 2,
      factor: height * 0.088
    }
  }, [width, height])

  return <group ref={r_wrapper}>
    <mesh
      position={[useMedia(height * 0.08, width * 0.0425, 0), useMedia(0, 0, width * .115), 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={e => handlePointer(e)}
    >
      <planeGeometry args={[useMedia(width - height * 0.16, width * 0.915, width), useMedia(height, height, height - width * .23), 64, 64]} />
      <landingMaterial ref={r_material} u_mouse={new Vector2(0.9, 0)} u_mouse_rad={screen.mobile ? 0 : 0.2} u_aspect={width / height}>
        <RenderTexture attach="u_texture">
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 1, 0]}
          >JACKSON TAYLOR IS
          </Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 2, 0]}
          >A CREATIVE DEVELOPER</Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 3, 0]}
          >WITH AN EMPHASIS</Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 4, 0]}
          >IN INTERACTIVE WEB</Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 5, 0]}
          >ANIMATIONS, MOTION</Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 6, 0]}
          >DESIGN, & 3D ONLINE</Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 7, 0]}
          >EXPERIENCES</Text>
          <Text
            {...textOpts}
            position={[text.x, text.y - text.factor * 9, 0]}
          >BASED IN ALASKA</Text>
        </RenderTexture>
      </landingMaterial>
    </mesh>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      wrapperClass="landing_content"
      position={[useMedia(height * 0.08, width * 0.0425, -1/factor) + 1/factor, useMedia(0, 0, width * .115), 0.001]}
      portal={{ current: scrollData.fixed }}
      zIndexRange={[0, 1]}
      style={{
        width: useMedia(width - height * 0.16, width * 0.915, width + 2/factor) * factor - 2,
        height: useMedia(height, height, height - width * .23) * factor
      }}
    >
      <div ref={r_slice1} className="landing_slice" style={{ transform: `translateX(120%)`}}>
        <h3>L<em>E</em>T'S {!screen.mobile && <>B<em>U</em>ILD</>}</h3>
      </div>
      <div ref={r_slice2} className="landing_slice" style={{ transform: `translateX(180%)`}}>
        <h3>{screen.mobile ? <>B<em>U</em>IL<em>D</em></> : <><em>S</em>O<em>MET</em>HI<em>NG</em></>}</h3>
      </div>
      <div ref={r_slice3} className="landing_slice" style={{ transform: `translateX(240%)`}}>
        <h3>{screen.mobile ? <><em>S</em>O<em>ME</em>-</> : <>NE<em>W</em></>}</h3>
      </div>
      <div ref={r_slice4} className="landing_slice" style={{ transform: `translateX(300%)`}} hidden={!screen.mobile}>
        <h3><em>T</em>HI<em>NG</em></h3>
      </div>
      <div ref={r_slice5} className="landing_slice" style={{ transform: `translateX(360%)`}} hidden={!screen.mobile}>
        <h3>NE<em>W</em></h3>
      </div>
    </Html>
    <group ref={r_arrow} position={[width / 2 - arrowPadding, height/2 - arrowPadding, 0]}>
      <Html
        center
        // transform
        // distanceFactor={3.4}
        zIndexRange={[2, 3]}
        wrapperClass="landing_arrow"
        portal={{ current: scrollData.fixed }}
        style={{ width: arrowSize * factor, height: arrowSize * factor}}
      >
        <LandingArrow innerRef={r_arrowInner}/>
      </Html>
    </group>
  </group>
}

export default Landing
