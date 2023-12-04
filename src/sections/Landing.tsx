// libraries
import { ReactThreeFiber, extend, useFrame, useThree } from "@react-three/fiber"
import { Html, PerspectiveCamera, RenderTexture, Text, shaderMaterial, useScroll } from "@react-three/drei"
import { Texture, Vector3 } from 'three'
import { useRef } from "react"
// modules
import BorderedPlane from "../components/BorderedPlane.tsx"
import { colors, sNoise } from "../utils/constants.ts"

const LandingMaterial = shaderMaterial({
  u_texture: new Texture,
  u_time: 0
}, `
  varying vec2 v_uv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_uv = uv;
  }
`,`
  ${sNoise}
  uniform float u_time;
  uniform sampler2D u_texture;
  varying vec2 v_uv;

  vec2 distortUV(vec2 uv, vec2 uv2, float intensity) {
    float scale = 10.;
    float speed = 0.02;

    uv2.x += u_time * speed;
    uv2.y += u_time * speed;

    uv += snoise(vec3(uv2 * scale, 0.)) * intensity;

    return uv;
  }


  void main () {
    vec2 uv = v_uv;
    vec2 uv2 = v_uv;

    vec4 texture0 = texture2D(u_texture, distortUV(uv, uv2, 0.001));
    vec4 texture1 = texture2D(u_texture, distortUV(uv, uv2, 0.004));
    vec4 texture2 = texture2D(u_texture, distortUV(uv, uv2, -0.003));
    vec4 color;

    if (texture0.r > 0.001) {
      color = texture0 + texture1 + texture2;
    } else if (texture1.r > 0.001 && texture2.g > 0.001 || texture1.r > 0.001 && texture2.b > 0.001) {
      color = texture0 + texture1 + texture2;
    } else {
      color = vec4(texture1.r, texture2.gb, 1.);
    }

    gl_FragColor = color;
  }
`)

type t_LandingMaterial = {
  u_texture: Texture
  u_time: number
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      landingMaterial: ReactThreeFiber.Object3DNode<t_LandingMaterial, typeof LandingMaterial>
    }
  }
}

extend({ LandingMaterial })

const Landing = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height } = viewport.getCurrentViewport()
  // distorted text material
  const r_material = useRef<t_LandingMaterial>(null!)
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
    width={width}
    height={height/4}
    factor={viewport.factor}
    position={new Vector3(width * (i + 1), height/2 - height/8 - (i * height/4), 0)}
    background={colors.fadedBlack}
    border={colors.dirtyWhite}
    groupRef={r_slices[i]}
  >
    <Html
      center
      // occlude
      zIndexRange={[0, 100]}
      wrapperClass="landing__slice"
      portal={{ current: scrollData.fixed }}
    >
      <h3>{slice}</h3>
    </Html>
  </BorderedPlane>)

  useFrame((_s, delta) => {
    const sliceOffset = scrollData.range(0, 0.05)
    const sectionOffset = scrollData.range(0.05, 0.05)

    r_slices.forEach((r_slice, i) => r_slice.current.position.x = width * (i * .5 + 1) * (1 - sliceOffset))
    r_wrapper.current.position.x = -width * (sectionOffset)
    r_material.current.u_time += delta
  })

  return <group ref={r_wrapper}>
    <mesh>
      <planeGeometry args={[width, height, 64, 64]} />
      <landingMaterial ref={r_material}>
        <RenderTexture attach="u_texture">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <color attach="background" args={[colors.fadedBlack]} />
          {renderText()}
        </RenderTexture>
      </landingMaterial>
    </mesh>
    <group position={[0, 0, 0.0001]}>
      {renderSlices([<>L<em>E</em>T'S B<em>U</em>ILD</>, <><em>SOMETH</em>I<em>NG</em></>, <>NE<em>W</em></>])}
    </group>
  </group>
}

export default Landing
