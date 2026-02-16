import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { Texture } from "three"

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
    pos.y -= u_delta * sin(uv.x * 3.) * 300.;

    float angle = u_progress * 3.14159 / 2.;
    float wave = cos(angle);
    float c = sin(length(uv - .5) * 10. + u_progress * 16.) * .5 + .5;
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

export type t_selectedWorksMaterial = {
  u_texture: Texture
  u_progress: number
  u_zoom: number
  u_delta: number
}


declare module '@react-three/fiber' {
  interface ThreeElements {
    selectedWorksMaterial: ThreeElements['shaderMaterial'] & t_selectedWorksMaterial
  }
}


extend({ SelectedWorksMaterial })