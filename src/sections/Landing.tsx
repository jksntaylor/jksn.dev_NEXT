// libraries
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { Html, PerspectiveCamera, RenderTexture, Text, useScroll } from "@react-three/drei"
import { Vector2, Vector3 } from 'three'
import { useRef } from "react"
// modules
import BorderedPlane from "../components/BorderedPlane.tsx"
import { t_LandingMaterial } from "../components/Materials.ts"
import { colors } from "../utils/constants.ts"
import { lerp } from "../utils/functions.tsx"

const Landing = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  // distorted text material
  const r_material = useRef<t_LandingMaterial>(null!)
  const r_mouse = useRef({ target: new Vector2(2, 2), current: new Vector2(2, 2) })
  // wrapper ref
  const r_wrapper = useRef<THREE.Group>(null!)
  // distorted text lines
  const r_text1 = useRef<typeof Text>(null!)
  const r_text2 = useRef<typeof Text>(null!)
  const r_text3 = useRef<typeof Text>(null!)
  // "lets build something new" slices
  const r_slice1 = useRef<THREE.Group>(null!)
  const r_slice2 = useRef<THREE.Group>(null!)
  const r_slice3 = useRef<THREE.Group>(null!)
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
    letterSpacing: -0.02,
    maxWidth: 12,
    font: '/fonts/NeueMontreal400.woff',
    scale: new Vector3(width / 12, width / 12, 1),
    anchorX: 'left',
    anchorY: 'bottom'
  }

  const renderText = () => <>
    <Text ref={r_text1} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 12) * 2 + 0.1, 0]}>JACKSON TAYLOR IS A</Text>
    <Text ref={r_text2} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 12) + 0.1, 0]}>CREATIVE DEVELOPER</Text>
    <Text ref={r_text3} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + 0.1, 0]}>BASED IN SALT LAKE  </Text>
  </>

  const renderSlices = (slices: React.ReactNode[]) => slices.map((slice, i) => <BorderedPlane
    key={i}
    width={width * 0.915}
    height={width/6}
    factor={factor}
    position={new Vector3(width * (i + 1) + width * 0.085, height/2 - width/12 - (i * width/6) + ((i + 1) * 1/factor), 0)}
    groupRef={r_slices[i]}
  >
    <Html
      center
      // transform
      // distanceFactor={3.7}
      zIndexRange={[2, 3]}
      wrapperClass="landing__slice"
      portal={{ current: scrollData.fixed }}
    >
      <h3>{slice}</h3>
    </Html>
  </BorderedPlane>)

  useFrame((_s, delta) => {
    const sliceOffset = scrollData.range(0, 0.05)
    const sectionOffset = scrollData.range(0.05, 0.05)

    r_slices.forEach((r_slice, i) => r_slice.current.position.x = width * (i * .5 + 1) * (1 - sliceOffset) + 1/factor + width * 0.0425)
    r_wrapper.current.position.x = -width * 0.915 * sectionOffset
    r_material.current.u_time += delta

    if (r_mouse.current.target.distanceTo(r_mouse.current.current) > 0.01) {
      const mouseX = lerp(r_mouse.current.current.x, r_mouse.current.target.x, 0.1)
      const mouseY = lerp(r_mouse.current.current.y, r_mouse.current.target.y, 0.1)
      r_material.current.u_mouse.set(mouseX, mouseY)
      r_mouse.current.current.set(mouseX, mouseY)
    }
  })

  const handlePointer = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) r_mouse.current.target.set(e.uv?.x, e.uv.y)
  }

  return <group ref={r_wrapper}>
    <mesh position={[width * 0.0425, 0, 0]} onPointerMove={e => handlePointer(e)}>
      <planeGeometry args={[width * 0.915, height, 64, 64]} />
      <landingMaterial ref={r_material} u_mouse={new Vector2(2, 2)}>
        <RenderTexture attach="u_texture">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <color attach="background" args={[colors.fadedBlack]} />
          {renderText()}
        </RenderTexture>
      </landingMaterial>
    </mesh>
    <group position={[0, 0, 0.0001]}>
      {renderSlices([<>L<em>E</em>T'S B<em>U</em>ILD</>, <><em>S</em>O<em>MET</em>HI<em>NG</em></>, <>NE<em>W</em></>])}
    </group>
  </group>
}

export default Landing
