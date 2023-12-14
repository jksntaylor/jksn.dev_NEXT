import { ReactThreeFiber, extend } from "@react-three/fiber"
import { Texture } from "three"
import { sNoise } from "../utils/constants"
import { shaderMaterial } from "@react-three/drei"

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

export type t_LandingMaterial = {
  u_texture: Texture
  u_time: number
}

const SelectedWorksMaterial = shaderMaterial({
  u_texture: new Texture(),
  u_delta: 0
},`
  uniform float u_delta;
  varying vec2 v_uv;

  void main() {
    vec4 pos = vec4(position, 1.0);
    pos.y -= u_delta * sin(uv.x * 16.) * 100.;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
    v_uv = uv;
  }
`,`
  uniform sampler2D u_texture;
  uniform float u_delta;
  varying vec2 v_uv;

  void main() {
    float angle = 1.8;
    vec2 offset = u_delta * vec2(cos(angle), sin(angle)) * 10.;
    float r = texture2D(u_texture, v_uv + offset).r;
    vec2 gb = texture2D(u_texture, v_uv - offset).gb;
    vec4 color = vec4(r, gb, 1.0);
    gl_FragColor = color;
  }
`)

export type t_SelectedWorksMaterial = {
  u_texture: Texture
  u_delta: number
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      landingMaterial: ReactThreeFiber.Object3DNode<t_LandingMaterial, typeof LandingMaterial>,
      selectedWorksMaterial: ReactThreeFiber.Object3DNode<t_SelectedWorksMaterial, typeof SelectedWorksMaterial>
    }
  }
}

extend({ LandingMaterial, SelectedWorksMaterial })
