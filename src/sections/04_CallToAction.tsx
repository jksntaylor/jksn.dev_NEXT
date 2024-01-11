// libraries
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { t_sphereMaterial } from "../components/Materials"
// modules


const CallToAction = () => {
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const scrollData = useScroll()

  const r_wrapper = useRef<THREE.Group>(null!)
  const r_slice1 = useRef<HTMLDivElement>(null!)
  const r_slice2 = useRef<HTMLDivElement>(null!)
  const r_slice3 = useRef<HTMLDivElement>(null!)
  const r_slices = [r_slice1, r_slice2, r_slice3]

  const r_sphere = useRef<THREE.Mesh>(null!)
  const r_mat = useRef<t_sphereMaterial>(null!)

  useFrame((_, delta) => {
    const sectionOffset = scrollData.range(0.8, 0.05)
    const sliceOffset = scrollData.range(0.85, 0.05)
    const sphereOffset = scrollData.range(0.9, 0.08)
    const sectionOffset2 = scrollData.range(0.975, 0.025)

    if (sectionOffset === 0 && r_wrapper.current.position.x !== width * .915) {
      r_wrapper.current.position.x = width * .9575
    } else if (sectionOffset > 0 && sectionOffset2 < 1) {
      r_wrapper.current.position.x = -width * 0.915 * sectionOffset + width * 0.9575 - width * 0.4575 * sectionOffset2
      r_slices.forEach((r_slice, i) => r_slice.current.style.transform = `translateX(${sliceOffset * -(120 + 60 * i)}%)`)
      if (sliceOffset > 0) {
        r_mat.current.u_time += delta
        r_sphere.current.rotation.x = sphereOffset * Math.PI / 3 + Math.PI / 6
      }
    } else if (sectionOffset2 === 1 && r_wrapper.current.position.x !== -width * 0.915) {
      r_wrapper.current.position.x = -width * 0.415
      r_mat.current.u_time += delta
    }
  })

  return <group ref={r_wrapper} position={[width * .9575, 0, 0]}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="motto_slices"
      zIndexRange={[3, 4]}
      portal={{ current: scrollData.fixed }}
      style={{
        width: width * 0.915 * factor,
        height: height * factor
      }}
    >
    <div ref={r_slice1} className="landing_slice">
      <h3>L<em>E</em>T'S B<em>U</em>ILD</h3>
    </div>
    <div ref={r_slice2} className="landing_slice">
      <h3><em>S</em>O<em>MET</em>HI<em>NG</em></h3>
    </div>
    <div ref={r_slice3} className="landing_slice">
      <h3>NE<em>W</em></h3>
    </div>
    </Html>
    <mesh ref={r_sphere}>
      <icosahedronGeometry args={[height * 0.3, 128]} />
      <sphereMaterial ref={r_mat} />
    </mesh>
  </group>
}

export default CallToAction
