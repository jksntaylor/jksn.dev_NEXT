import { ReactThreeFiber, extend, useFrame, useThree } from "@react-three/fiber"
import { colors, sNoise } from "../utils/constants.ts"
import { Html, PerspectiveCamera, RenderTexture, Text, shaderMaterial, useScroll } from "@react-three/drei"
import { Texture, Vector3 } from 'three'
import { useRef } from "react"
import BorderedPlane from "../components/BorderedPlane.tsx"
import { split } from "../utils/functions.tsx"

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
    float speed = 0.03;

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
  const { factor } = viewport
  const { width, height } = viewport.getCurrentViewport()
  // distorted text material
  const r_material = useRef<t_LandingMaterial>(null!)
  // distorted text lines
  const r_text1 = useRef<typeof Text>(null!)
  const r_text2 = useRef<typeof Text>(null!)
  const r_text3 = useRef<typeof Text>(null!)
  // "lets build something new" slices
  // const r_slice1 = useRef(null!)
  // const r_slice2 = useRef(null!)
  // const r_slice3 = useRef(null!)

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
    letterSpacing: -0.03,
    maxWidth: 12,
    font: '/fonts/NeueMontreal400.woff',
    scale: new Vector3(width / 15, width / 15, 1),
    anchorX: 'left',
    anchorY: 'bottom'
  }

  const renderText = () => {
    return <>
      <Text ref={r_text1} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 15) * 2 + 0.1, 0]}>JACKSON TAYLOR IS A</Text>
      <Text ref={r_text2} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 15) + 0.1, 0]}>CREATIVE DEVELOPER</Text>
      <Text ref={r_text3} {...textOptions} position={[-width / 2 + 0.1, -height / 2 + 0.1, 0]}>BASED IN SALT LAKE CITY</Text>
    </>
  }

  const renderSlices = (strings: string[]) => {
    return strings.map((string, i) => <BorderedPlane
      key={i}
      width={width}
      height={height/4}
      factor={factor}
      position={new Vector3(0, height/2 - height/8 - (i * height/4), 0)}
      background={colors.fadedBlack}
      border={colors.dirtyWhite}
    >
      <Html transform occlude portal={{ current: scrollData.fixed }}>{split(string)}</Html>
      {/* <Text>
        {string}
        <meshBasicMaterial color="red" />
      </Text> */}
    </BorderedPlane>)
  }

  useFrame((_s, delta) => {
    r_material.current.u_time += delta
  })

  return <group>
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
      {renderSlices([`lEt'S bUild`, `something`, `neW`])}
    </group>
  </group>
}

export default Landing
