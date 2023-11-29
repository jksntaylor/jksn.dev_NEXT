import { ReactThreeFiber, extend, useFrame, useThree } from "@react-three/fiber"
import { colors, sNoise } from "../utils/constants.ts"
import { RenderTexture, Text, shaderMaterial } from "@react-three/drei"
import { Texture, Vector3 } from 'three'
import { useRef } from "react"

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
    float scale = 20.;
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
  const { width, height } = useThree(state => state.viewport.getCurrentViewport())
  const r_material = useRef<t_LandingMaterial>(null!)

  const textOptions = {
    fillOpacity: 1,
    color: colors.dirtyWhite,
    lineHeight: 1,
    letterSpacing: -0.03,
    maxWidth: 12,
    font: '/fonts/NeueMontreal400.woff',
    anchorX: 'left',
    anchorY: 'bottom',
    scale: new Vector3(width / 15, width / 15, 1)
  }

  useFrame((_s, delta) => {
    r_material.current.u_time += delta
  })
  return <group>
    <mesh>
      <planeGeometry args={[width, height, 64, 64]} />
      {/* <meshBasicMaterial color={colors.dirtyWhite} /> */}
      <landingMaterial ref={r_material}>
        <RenderTexture attach="u_texture">
          <color attach="background" args={[colors.fadedBlack]} />
          <Text {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 15) * 2 + 0.1, 0]}>JACKSON TAYLOR IS A</Text>
          <Text {...textOptions} position={[-width / 2 + 0.1, -height / 2 + (width / 15) + 0.1, 0]}>CREATIVE DEVELOPER</Text>
          <Text {...textOptions} position={[-width / 2 + 0.1, -height / 2 + 0.1, 0]}>BASED IN SALT LAKE CITY</Text>
        </RenderTexture>
      </landingMaterial>
      {/* white background plane */}
    </mesh>
    <group>
      <mesh>
        {/* slice 1 */}
      </mesh>
      <mesh>
        {/* slice 2 */}
      </mesh>
      <mesh>
        {/* slice 3 */}
      </mesh>
    </group>
  </group>
}

export default Landing
