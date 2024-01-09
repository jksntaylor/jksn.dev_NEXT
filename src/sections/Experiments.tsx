import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import BorderedPlane from "../components/BorderedPlane"
import { Html, useScroll } from "@react-three/drei"
import { Vector3 } from "three"
import { colors } from "../utils/constants"


const Experiments = () => {
  const scrollData = useScroll()
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_sidebar = useRef<THREE.Group>(null!)
  const r_sidebarInner = useRef<HTMLDivElement & { children: HTMLElement[] }>(null!)
  const r_experiments = useRef<THREE.Group>(null!)

  useFrame(() => {
    const sectionOffset = scrollData.range(.56, .05)
    const sidebarOffset = scrollData.range(.61, .05)
    const sectionOffset2 = scrollData.range(.76, .05)

    if (sectionOffset === 0 && r_wrapper.current.position.x !== width * .9575) {
      r_wrapper.current.position.x = width * .9575
    } else if (sectionOffset > 0 && sectionOffset2 < 1) {
      r_wrapper.current.position.x = -width * .915 * sectionOffset + width * .9575
      if (r_sidebar.current) {
        r_sidebarInner.current.style.width = `${(width * .06 + (1 - sidebarOffset) * width * .24) * factor}px`
        r_sidebarInner.current.children[0].style.transform = `scaleX(${3.25 - sidebarOffset * 2.85})`
        r_sidebarInner.current.children[0].style.fontWeight = `${800 - sidebarOffset * 200}`

        r_sidebar.current.scale.x = (1 - sidebarOffset) * .8 + .2
        r_sidebar.current.children[2].scale.x = 1 / r_sidebar.current.scale.x
        r_sidebar.current.children[0].scale.x = .02 * sidebarOffset + 1
        r_sidebar.current.position.x = -width/2 + width * 0.0425 + width * (0.15 - sidebarOffset * 0.119)
      }

    }
  })
  return <group ref={r_wrapper} position={[width * .915, 0, 0]}>
    <BorderedPlane // Top Section
      width={width * .915}
      height={width * .046}
      factor={factor}
      position={new Vector3(-1/factor, height / 2 - width * .023 + 1/factor, 0)}
    >
      <Html
        // center
        transform
        distanceFactor={3.4}
        className="experiments_top"
        portal={{ current: scrollData.fixed }}
        style={{
          width: width * .915 * factor,
          height: width * .046 * factor,
          borderBottom: `1px solid ${colors.dirtyWhite}`
        }}
        zIndexRange={[5, 6]}
      >
        <div className='section_number' style={{ width: width * 0.06 * factor }}>02</div>
        <div className="section_title">Experiments</div>
      </Html>
    </BorderedPlane>
    <BorderedPlane // Sidebar
      width={width * 0.3}
      height={height - width * 0.046 + 2/factor}
      factor={factor}
      position={new Vector3(-width/2 + width * 0.1925, -width * 0.023 + 1/factor, 0)}
      groupRef={r_sidebar}
    >
      <Html
        // center
        transform
        distanceFactor={3.4}
        className="experiments_side"
        portal={{ current: scrollData.fixed }}
        ref={r_sidebarInner}
        style={{
          width: width * 0.3 * factor,
          height: (height - width * 0.046) * factor + 4,
        }}
        zIndexRange={[5, 6]}
      >
        <p className="experiments_side_text">E<em>X</em>PERIME<em>N</em>TS</p>
      </Html>
    </BorderedPlane>
    <group ref={r_experiments}> // Experiments Carousel

    </group>
  </group>
}

export default Experiments
