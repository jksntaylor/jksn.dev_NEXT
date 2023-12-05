import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import BorderedPlane from "../components/BorderedPlane"
import { useRef } from 'react'
import { Vector3 } from "three"

const SelectedWorks = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { factor } = viewport
  const { width, height } = viewport.getCurrentViewport()
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_counter1 = useRef<HTMLDivElement>(null!)
  const r_counter2 = useRef<HTMLDivElement>(null!)

  useFrame(() => {
    const sectionOffset = scrollData.range(0.1675, 0.05)
    // const sidebarOffset = scrollData.range(0.2175, 0.025)
    const projectsOffset = scrollData.range(0.2425, 0.1)
    const counterOffset = scrollData.range(0.3325, 0.01) // just for counter first column (0 - 1)

    // section horizontal movement
    r_wrapper.current.position.x = -width * sectionOffset + width
    r_counter2.current.style.transform = `translateY(${projectsOffset * -90}%)`
    r_counter1.current.style.transform = `translateY(${counterOffset * -52}%)`
    // sidebar width + font size calculation
    // r_sidebar.current.width =
    // r_sidebar.current.position =
    // r_sidebarText.current.fontSize =
    // project "scrolling"

  })

  return <BorderedPlane // Wrapper
    width={width + 2/factor}
    height={height + 2/factor}
    factor={factor}
    position={new Vector3(width, 0, 0.002)}
    groupRef={r_wrapper}
  >
    <BorderedPlane // Section Number
      width={width * 0.048 + 2/factor}
      height={width * 0.046}
      factor={factor}
      position={new Vector3(-width / 2 + width * 0.024, height / 2 - width * 0.023, 0)}
    >
      <Html center className="section_number" portal={{ current: scrollData.fixed }} zIndexRange={[0, 100]}>02</Html>
    </BorderedPlane>
    <BorderedPlane // Project Counter
      width={width * 0.952}
      height={width * 0.046}
      factor={factor}
      position={new Vector3(-width / 2 + width * 0.524, height / 2 - width * 0.023)}
    >
      <Html style={{ width: width * 0.952 * factor }} center className="selectedworks_counter" portal={{ current: scrollData.fixed }} zIndexRange={[0, 100]}>
        <div className="selectedworks_counter_column" ref={r_counter1}>01</div>
        <div className="selectedworks_counter_column" ref={r_counter2}>1234567890</div>
        <span>/10</span>
      </Html>
    </BorderedPlane>
    {/* <BorderedPlane // Sidebar
      width={width}
      height={height - width * 0.046}
      factor={viewport.factor}
    >
      <Html>Selected <span><em>W</em>orks</span> &copy;</Html>
    </BorderedPlane> */}
  </BorderedPlane>
}

export default SelectedWorks
