import { ReactThreeFiber, extend } from "@react-three/fiber"
import { Texture, Vector2 } from "three"
import { sNoise } from "../utils/constants"
import { shaderMaterial } from "@react-three/drei"

const LandingMaterial = shaderMaterial({
  u_texture: new Texture,
  u_aspect: 1,
  u_mouse: new Vector2,
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
  uniform vec2 u_mouse;
  uniform float u_aspect;
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

    // mouse mask
    float cursor_distance = distance(vec2(v_uv.x, v_uv.y / u_aspect), vec2(u_mouse.x, u_mouse.y / u_aspect));
    float strength = smoothstep(0.2, 0.1, cursor_distance);
    float offX = v_uv.x + sin(v_uv.y + u_time * .1);
    float offY = v_uv.y - u_time * 0.01 - cos(u_time * 0.001) * 0.1;
    float n = snoise(vec3(offX, offY, u_time * .1) * 9.);
    float mask = smoothstep(0.05, 1., strength * (n + 1.) * 0.75) * (1. - distance(v_uv, u_mouse) * 5.);

    // text distortion
    vec4 texture0 = texture2D(u_texture, distortUV(uv, uv2, 0.001 + mask * 0.2));
    vec4 texture1 = texture2D(u_texture, distortUV(uv, uv2, 0.004 + mask * 0.2));
    vec4 texture2 = texture2D(u_texture, distortUV(uv, uv2, -0.003 + mask * 0.2));
    vec4 color;

    // color blending
    if (texture0.r > 0.001) {
      color = texture0 + texture1 + texture2;
    } else if (texture1.r > 0.001 && texture2.g > 0.001 || texture1.r > 0.001 && texture2.b > 0.001) {
      color = texture0 + texture1 + texture2;
    } else {
      color = vec4(texture1.r, texture2.gb, 1.);
    }

    // color correction
    color.r = min(color.r, 0.941);
    color.g = min(color.g, 0.902);
    color.b = min(color.b, 0.902);

    vec4 color2 = vec4(vec3(mask), 1.);

    gl_FragColor = color;
  }
`)

export type t_LandingMaterial = {
  u_texture: Texture
  u_aspect: number
  u_mouse: Vector2
  u_time: number
}

const SelectedWorksMaterial = shaderMaterial({
  u_texture: new Texture(),
  u_progress: 0,
  u_zoom: 1,
  u_delta: 0
},`
  uniform float u_delta;
  uniform float u_progress;
  uniform float u_zoom;
  varying vec2 v_uv;

  void main() {
    vec4 pos = vec4(position, 1.0);
    pos.y -= u_delta * sin(uv.x * 50.) * 100.;

    float angle = u_progress * 3.14159 / 2.;
    float wave = cos(angle);
    float c = sin(length(uv - .5) * 15. + u_progress * 12.) * .5 + .5;
    pos.x *= mix(1., u_zoom + wave * c, u_progress);
    pos.y *= mix(1., u_zoom + wave * c, u_progress);

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
  u_progress: number
  u_zoom: number
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
