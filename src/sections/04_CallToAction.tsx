// libraries
import { Environment, Html, Lightformer, MeshReflectorMaterial, Text3D, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useRef } from "react"
// modules
import { t_sphereMaterial } from "../components/Materials"
import { ScreenContext } from "../components/Providers"
import { useMedia } from "../utils/hooks"
// assets
import '../styles/CallToAction.scss'

const CallToAction = () => {
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const scrollData = useScroll()
  const screen = useContext(ScreenContext)

  const r_wrapper = useRef<THREE.Group>(null!)
  const r_slice1 = useRef<HTMLDivElement>(null!)
  const r_slice2 = useRef<HTMLDivElement>(null!)
  const r_slice3 = useRef<HTMLDivElement>(null!)
  const r_slice4 = useRef<HTMLDivElement>(null!)
  const r_slice5 = useRef<HTMLDivElement>(null!)
  const r_slices = [r_slice1, r_slice2, r_slice3, r_slice4, r_slice5]

  const r_text = useRef<THREE.Mesh>(null!)
  const r_sphere = useRef<THREE.Mesh>(null!)
  const r_mat = useRef<t_sphereMaterial>(null!)

  const wrapperOffsets = useMedia(
    { start: width - height * .16, move: width - height * .08 },
    { start: width * .915, move: width * .9575 },
    { start: width, move: width }
  )

  const sphereSize = useMedia(
    { rad: height * .2, position: height * .7, offset: height * .2 },
    { rad: height * .15, position: height * .45, offset: height * .15},
    { rad: width * .15, position: width/2, offset: 0 }
  )

  const creditsWidth = useMedia(height * .8, width * .4575, width)

  useFrame((_, delta) => {
    const sectionRange = scrollData.range(0.8, 0.05)
    const sliceRange = scrollData.range(0.85, 0.05)
    const sphereRange = scrollData.range(0.9, 0.08)
    const sectionRange2 = scrollData.range(0.975, 0.025)

    if (sectionRange === 0 && r_wrapper.current.position.x !== wrapperOffsets.move) {
      r_wrapper.current.position.x = wrapperOffsets.move
    } else if (sectionRange > 0 && sectionRange2 < 1) {
      r_wrapper.current.position.x = -wrapperOffsets.start * sectionRange + wrapperOffsets.move - creditsWidth * sectionRange2
      r_slices.forEach((r_slice, i) => r_slice.current.style.transform = `translateX(${sliceRange * -(120 + 60 * i)}%)`)
      if (sliceRange > 0) {
        r_sphere.current.rotation.x = sphereRange * Math.PI / 5 + Math.PI / 5
        r_sphere.current.position.x = (width/2 - sphereSize.position) + sectionRange2 * sphereSize.offset
      }
    } else if (sectionRange2 === 1 && r_wrapper.current.position.x !== -wrapperOffsets.start/2) {
      r_wrapper.current.position.x = -wrapperOffsets.start * 1 - creditsWidth + wrapperOffsets.move
    }

    if (sliceRange === 0) {
      if (r_text.current.visible) r_text.current.visible = false
      if (r_sphere.current.visible) r_sphere.current.visible = false
    } else {
      r_mat.current.u_time += delta
      if (!r_text.current.visible) r_text.current.visible = true
      if (!r_sphere.current.visible) r_sphere.current.visible = true
    }
  })

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('toggleContact'))
  }

  return <group ref={r_wrapper} position={[wrapperOffsets.move, useMedia(0, 0, width * .115), 0]}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="motto_slices"
      zIndexRange={[3, 4]}
      portal={{ current: scrollData.fixed }}
      style={{
        width: useMedia(width - height * .16, width * 0.915, width) * factor,
        height: useMedia(height, height, height - width * .23) * factor
      }}
    >
      <div className="motto_top" style={{ height: useMedia(height * .08, width * .046, width * .12) * factor - 1, }}>
        <div className="section_number" style={{ width: useMedia(height * .08, width * .046, width * .12) * factor }}>04</div>
        <p className="section_title">Contact</p>
      </div>
      <div className="motto_cta"  style={{ height: useMedia(height * .92, height - width * 0.046, 0) / 2 * factor }}>
        <p>I encourage the clients I partner with to push the<br/>bounds of web technologies wherever possible.<br/><br/>Ready to get started? </p>
        <button onClick={handleClick}>LET'<em>S</em> T<em>A</em>LK →</button>
      </div>
      <div ref={r_slice1} className="landing_slice">
        <h3>L<em>E</em>T'S {!screen.mobile && <>B<em>U</em>ILD</>}</h3>
      </div>
      <div ref={r_slice2} className="landing_slice">
        <h3>{screen.mobile ? <>B<em>U</em>IL<em>D</em></> : <><em>S</em>O<em>MET</em>HI<em>NG</em></>}</h3>
      </div>
      <div ref={r_slice3} className="landing_slice">
        <h3>{screen.mobile ? <><em>S</em>O<em>ME</em>-</> : <>NE<em>W</em></>}</h3>
      </div>
      <div ref={r_slice4} className="landing_slice" hidden={!screen.mobile}>
        <h3><em>T</em>HI<em>NG</em></h3>
      </div>
      <div ref={r_slice5} className="landing_slice" hidden={!screen.mobile}>
        <h3>NE<em>W</em></h3>
      </div>
    </Html>

    <mesh ref={r_sphere} position={[width / 2 - sphereSize.position, height / 2 - height * 0.6, 0]}>
      <icosahedronGeometry args={[sphereSize.rad, 128]} />
      <sphereMaterial ref={r_mat} />
    </mesh>
    <Text3D
      ref={r_text}
      position={[-width/2, height / 2 - height * .25, useMedia(-height * .2, -height * .15, 0)]}
      size={useMedia(height * .25, height * .25, width * .17)}
      rotation={[Math.PI * 0.005, useMedia(Math.PI * 0.005, 0, 0), 0]}
      lineHeight={.7}
      letterSpacing={.05}
      scale={[1.15, .8, .5]}
      font={'/fonts/FormulaCondensedBold.json'}
    >
      {`that's my\nmotto.`}
      <MeshReflectorMaterial
        blur={[15, 15]}
        mixBlur={1}
        mixStrength={useMedia(100, 100, 50)}
        resolution={1024}
        mirror={1}
        depthScale={1}
        reflectorOffset={useMedia(-0.2, -0.2, -1)}
        envMapIntensity={0.15}
      />
    </Text3D>
    <Environment resolution={16}>
      {/* Fill */}
      <Lightformer intensity={35} color="#ffe0e2" rotation-y={Math.PI / 2} position={[0, 1, 1]} target={[0, 0, 0]} scale={[1, 1, 1]} />
      {/* <Lightformer intensity={100} color="#e600e6" rotation-y={Math.PI / 2} position={[2, 1, 0.1]} target={[-width, height, 0]} scale={[1, 1, 1]} /> */}
      {/* Key */}
      <Lightformer form="circle" color="#cff8ff" intensity={100} scale={2} position={[2, -2, -3]} target={[0, 0, 0]}/>
      <Lightformer form="circle" color="#cff8ff" intensity={10} scale={2} position={[-2, -2, -3]} target={[0, 0, 0]}/>
    </Environment>
  </group>
}

export default CallToAction
