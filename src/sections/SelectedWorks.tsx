// libraries
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from 'react'
import { Vector3 } from "three"
// modules
import BorderedPlane from "../components/BorderedPlane"
// assets
import { projectData } from "../utils/data"

const SelectedWorks = () => {
  const scrollData = useScroll()

  const { viewport } = useThree()
  const { factor } = viewport
  const { width, height } = viewport.getCurrentViewport()

  const r_wrapper = useRef<THREE.Group>(null!)

  const r_counter1 = useRef<HTMLDivElement>(null!)
  const r_counter2 = useRef<HTMLDivElement>(null!)

  const r_sidebar = useRef<THREE.Group & { children: [THREE.Mesh, THREE.Mesh] }>(null!)
  const r_sidebarText = useRef<HTMLDivElement>(null!)
  const r_sidebarTextSpan = useRef<HTMLSpanElement>(null!)

  const r_projects = useRef<THREE.Group>(null!)

  const renderProjects = () => {
    return projectData.map((_project, index) => <group key={index}>
      <Html center className="selectedworks_project" portal={{ current: scrollData.fixed }} zIndexRange={[0, 100]}>
      </Html>
      {/* <Image /> */}
    </group>)
  }

  useFrame(() => {
    const sectionOffset = scrollData.range(0.1675, 0.05)
    const sidebarOffset = scrollData.range(0.2175, 0.025)
    const projectsOffset = scrollData.range(0.2425, 0.3)
    const counterOffset = scrollData.range(0.5075, 0.035) // just for counter first column (0 - 1)
    const sectionOffset2 = scrollData.range(0.5425, 0.05)

    // section horizontal movement
    r_wrapper.current.position.x = -width * sectionOffset + width - width * sectionOffset2

    if (r_counter1.current) r_counter1.current.style.transform = `translateY(${counterOffset * -50}%)`
    if (r_counter2.current) r_counter2.current.style.transform = `translateY(${projectsOffset * -90}%)`
    if (r_sidebar.current) { // sidebar width + position calculation
      r_sidebar.current.scale.x = (1 - sidebarOffset)* 0.8 + 0.2
      r_sidebar.current.children[0].scale.x = .008 * sidebarOffset + 1 // need to scale up background or the x-axis border is too thin
      r_sidebar.current.position.x = (-width/2 + width * 0.1) * sidebarOffset -1/factor
    }
    if (r_sidebarText.current) { // sidebar text scaling
      r_sidebarText.current.style.width = `${(1 - sidebarOffset) * (width * 0.8 * factor) + (width * 0.2 * factor)}px`
      r_sidebarText.current.style.fontSize = `${(1 - sidebarOffset) * 19.75 + 5.25}rem`
    }
    if (r_sidebarTextSpan.current) r_sidebarTextSpan.current.style.fontSize = `${(1 - sidebarOffset) * 18.5 + 5}rem`

    // project "scrolling"

  })

  return <BorderedPlane // Wrapper
    width={width + 2/factor} // x/factor is equivalent to x pixels
    height={height + 2/factor}
    factor={factor}
    position={new Vector3(width, 0, 0.002)}
    groupRef={r_wrapper}
  >
    <BorderedPlane // Section Number
      width={width * 0.048 + 2/factor}
      height={width * 0.046}
      factor={factor}
      position={new Vector3(-width / 2 + width * 0.024, height / 2 - width * 0.023 + 1/factor, 0)}
    >
      <Html center className="section_number" portal={{ current: scrollData.fixed }} zIndexRange={[0, 100]}>02</Html>
    </BorderedPlane>
    <BorderedPlane // Project Counter
      width={width * 0.952 + 1/factor}
      height={width * 0.046}
      factor={factor}
      position={new Vector3(-width / 2 + width * 0.524 + 0.5/factor, height / 2 - width * 0.023 + 1/factor, 0)}
    >
      <Html style={{ width: width * 0.952 * factor }} center className="selectedworks_counter" portal={{ current: scrollData.fixed }} zIndexRange={[0, 100]}>
        <div className="selectedworks_counter_column" ref={r_counter1}>01</div>
        <div className="selectedworks_counter_column" ref={r_counter2}>1234567890</div>
        <span>/10</span>
      </Html>
    </BorderedPlane>
    <BorderedPlane // Sidebar
      width={width + 1/factor}
      height={height - width * 0.046 + 2/factor}
      factor={factor}
      position={new Vector3(-1/factor, -width * 0.023 + 1/factor, 0)}
      groupRef={r_sidebar}
    >
      <Html
        style={{ width: width/factor, height: (height - width * 0.046) * factor}}
        center
        className="selectedworks_header"
        portal={{ current: scrollData.fixed }}
        zIndexRange={[0, 100]}
        ref={r_sidebarText}
      >
        <h4>Selected<br/><span ref={r_sidebarTextSpan}><em>W</em>ORKS &copy;</span></h4>
      </Html>
    </BorderedPlane>
    <group ref={r_projects}>
      {renderProjects()}
    </group>
  </BorderedPlane>
}

export default SelectedWorks
