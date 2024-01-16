// libraries
import { Html, MeshReflectorMaterial, RenderCubeTexture, Text3D, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { t_sphereInnerMaterial, t_sphereOuterMaterial } from "../components/Materials"
import { DoubleSide } from "three"
// modules

const CallToAction = () => {
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const scrollData = useScroll()

  const r_wrapper = useRef<THREE.Group>(null!)
  const r_slice1 = useRef<HTMLDivElement>(null!)
  const r_slice2 = useRef<HTMLDivElement>(null!)
  const r_slice3 = useRef<HTMLDivElement>(null!)
  const r_slices = [r_slice1, r_slice2, r_slice3]

  const r_text = useRef<THREE.Mesh>(null!)
  const r_sphere = useRef<THREE.Mesh>(null!)
  const r_matInner = useRef<t_sphereInnerMaterial>(null!)
  const r_matOuter = useRef<t_sphereOuterMaterial>(null!)

  useEffect(() => {
    r_matOuter.current.side = DoubleSide
  }, [])

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
        r_matInner.current.u_time += delta
        r_sphere.current.rotation.x = sphereOffset * Math.PI / 5 + Math.PI / 4
      }
    } else if (sectionOffset2 === 1 && r_wrapper.current.position.x !== -width * 0.915) {
      r_wrapper.current.position.x = -width * 0.415
      r_matInner.current.u_time += delta
      r_matOuter.current.u_time += delta
    }

    if (sectionOffset === 0) {
      r_text.current.visible = false
      r_sphere.current.visible = false
    } else {
      r_text.current.visible = true
      r_sphere.current.visible = true
    }
  })

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('toggleContact'))
  }

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
      <div className="motto_cta"  style={{ height: (height - width * 0.046) / 2 * factor }}>
        <p>I encourage the clients I partner with to push the bounds of web technologies wherever possible.<br/><br/>Ready to get started? </p>
        <button onClick={handleClick}>LET'<em>S</em> T<em>A</em>LK →</button>
      </div>
      <div className="motto_top" style={{ height: width * 0.046 * factor - 1 }}>
        <div className="section_number" style={{ width: width * 0.046 * factor }}>04</div>
        <p className="section_title">Contact</p>
      </div>
      <div ref={r_slice1} className="landing_slice"><h3>L<em>E</em>T'S B<em>U</em>ILD</h3></div>
      <div ref={r_slice2} className="landing_slice"><h3><em>S</em>O<em>MET</em>HI<em>NG</em></h3></div>
      <div ref={r_slice3} className="landing_slice"><h3>NE<em>W</em></h3></div>
    </Html>

    <mesh ref={r_sphere} position={[width / 2 - height * 0.45, height / 2 - height * 0.6, 0]}>
      <icosahedronGeometry args={[height * 0.15, 256]} />
      <sphereInnerMaterial ref={r_matInner} />
    </mesh>
    <Text3D
      ref={r_text}
      position={[-width / 2, height / 2 - height * 0.25, -height * 0.15]}
      size={height * 0.25}
      lineHeight={0.7}
      scale={[1.15, 0.8, 0.5]}
      font={'/fonts/FormulaCondensedBold.json'}
    >{`that's my\nmotto.`}<MeshReflectorMaterial
        blur={[15, 15]}
        mixBlur={1}
        mixStrength={100}
        resolution={1024}
        mirror={1}
        depthScale={5}
        reflectorOffset={-0.2}
        envMapIntensity={1.6}
      >
        <RenderCubeTexture attach="envMap">
          <mesh position={[width * 0.02, height * 0.2, 2]} scale={[1.1, 0.5, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[width * 0.55, 32, 32]} />
            <sphereOuterMaterial ref={r_matOuter}/>
          </mesh>
        </RenderCubeTexture>
      </MeshReflectorMaterial>
    </Text3D>
  </group>
}

export default CallToAction
