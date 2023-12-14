// libraries
import { Html, useScroll, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from 'react'
import { Vector3 } from "three"
// modules
import BorderedPlane from "../components/BorderedPlane"
// assets
import { projectData } from "../utils/data"
import tiktok from '../assets/images/tt_bg.webp'
import rre from '../assets/images/rre_bg.webp'
import genies from '../assets/images/genies_bg.webp'
import realtime from '../assets/images/rtr_bg.webp'
import levis from '../assets/images/levis_bg.webp'
import source7 from '../assets/images/s7_bg.webp'
import huge from '../assets/images/huge_bg.webp'
import { colors } from "../utils/constants"
import { t_SelectedWorksMaterial } from "src/components/Materials"

const images = [tiktok, rre, genies, source7, realtime, levis, huge, huge, huge, huge]

const SelectedWorks: React.FC<{toggleScroll: () => void}> = ({ toggleScroll }) => {
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

  const r_delta = useRef(0)

  const projContainerHeight = (height - width * 0.046) * projectData.length * factor
  const projectContainerOffsetY = ((projContainerHeight / projectData.length) * (projectData.length - 1)) / factor

  const openProject = () => {
    toggleScroll()
  }

  const Image: React.FC<{url: string, position: Vector3 }> = ({ url, position }) => {
    const r_mat = useRef<t_SelectedWorksMaterial>(null!)
    const texture = useTexture(url)

    useEffect(() => { r_mat.current.u_texture = texture }, [texture])

    useFrame(() => { if(r_mat.current.u_delta !== r_delta.current) r_mat.current.u_delta = r_delta.current })

    return <mesh position={position}>
      <planeGeometry args={[width * 0.374 , width * 0.444, 48, 1]} />
      <selectedWorksMaterial ref={r_mat} />
    </mesh>
  }

  const renderProjects = () => {
    return <group
      ref={r_projects}
      position= {[width * 0.0575, -width * 0.023, 0]}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="selectedworks_projects"
        portal={{ current: scrollData.fixed }}
        style={{ width: width * 0.625 * factor, height: projContainerHeight }}
        position={[0, -projContainerHeight/factor/2 + (height - width * 0.046)/4, 0]}
        zIndexRange={[0, 100]} >
        {projectData.map((proj, i) => <div className={`selectedworks_project selectedworks_project-${i%2?'right':'left'}`} key={i}>
          {proj.awards && <div className="selectedworks_project_awards">
            {proj.awards.map((award, i) => <span key={i}>{award}</span>)}
          </div>}
          <div className="selectedworks_project_info">
            <span>{proj.year}<br/>{proj.client1}<br/>{proj.client2 && proj.client2}</span>
            <span>{proj.role}<br/><a href={proj.link} target='_blank' rel='noopener noreferrer'>{proj.linkText}</a></span>
          </div>
          <h3 className="selectedworks_project_title">{proj.title}</h3>
          <button className="selectedworks_project_button" onClick={openProject}>Vie<em>w</em> Project →</button>
        </div>)}
      </Html>
      <group position={[0, 0, 0]}>
        {projectData.map((_proj, i) => { // extract into component (<SelectedWorksImage url={url}/>)
          const posX = i % 2 ? -width * 0.3125 + width * 0.187 : width * 0.3125 - width * 0.187
          return <Image url={images[i]} position={new Vector3(posX, (height - width * 0.046) * -i, 0)} key={i}/>
        })}
      </group>
    </group>
  }

  useFrame(() => {
    const sectionOffset = scrollData.range(0.1784, 0.05)
    const sidebarOffset = scrollData.range(0.2284, 0.025)
    const projectsOffset = scrollData.range(0.26, 0.3)
    const counterOffset = scrollData.range(0.525, 0.035) // just for counter first column (0 - 1)
    const sectionOffset2 = scrollData.range(0.56, 0.05)

    // section horizontal movement
    r_wrapper.current.position.x = -width * 0.915 * sectionOffset + width * 0.9575 - width * 0.915 * sectionOffset2

    if (r_counter1.current) r_counter1.current.style.transform = `translateY(${counterOffset * -50}%)`
    if (r_counter2.current) r_counter2.current.style.transform = `translateY(${projectsOffset * -90}%)`

    if (r_sidebar.current) { // sidebar width + position calculation
      r_sidebar.current.scale.x = (1 - sidebarOffset)* 0.8 + 0.2
      r_sidebar.current.children[2].scale.x = 1 / r_sidebar.current.scale.x
      r_sidebar.current.children[0].scale.x = .008 * sidebarOffset + 1 // need to scale up background or the x-axis border is too thin
      r_sidebar.current.position.x = (-width/2 + width * 0.135) * sidebarOffset -1/factor
    }

    if (r_sidebarText.current) { // sidebar text scaling
      r_sidebarText.current.style.width = `${(1 - sidebarOffset) * (width * 0.732 * factor) + (width * 0.183 * factor)}px`
      r_sidebarText.current.style.fontSize = `${(1 - sidebarOffset) * 19.75 + 5.25}rem`
    }

    if (r_sidebarTextSpan.current) r_sidebarTextSpan.current.style.fontSize = `${(1 - sidebarOffset) * 18.5 + 5}rem`

    if (r_projects.current) { // project "scrolling"
      r_projects.current.position.x = (width * (1 - sidebarOffset) * 0.7125) + width * 0.1
      r_delta.current = (r_projects.current.position.y - (projectsOffset * projectContainerOffsetY)) / 100
      r_projects.current.position.y = projectsOffset * projectContainerOffsetY
    }
  })

  return <group ref={r_wrapper}>
    <BorderedPlane // Section Number
      width={width * 0.048 + 2/factor}
      height={width * 0.046}
      factor={factor}
      position={new Vector3(-width / 2 + width * 0.0665, height / 2 - width * 0.023 + 1/factor, 0)}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="section_number"
        portal={{ current: scrollData.fixed }}
        zIndexRange={[0, 100]}
      >02</Html>
    </BorderedPlane>
    <BorderedPlane // Project Counter
      width={width * 0.867 + 1/factor}
      height={width * 0.046}
      factor={factor}
      position={new Vector3(-width / 2 + width * 0.524 + 0.5/factor, height / 2 - width * 0.023 + 1/factor, 0)}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        zIndexRange={[5, 6]}
        portal={{ current: scrollData.fixed }}
        className="selectedworks_counter"
        style={{
          width: width * 0.867 * factor,
          height: width * 0.046 * factor,
          background: colors.fadedBlack,
          borderBottom: `1px solid ${colors.dirtyWhite}`
        }}
      >
        <div className="selectedworks_counter-mask">
          <div className="selectedworks_counter_column" ref={r_counter1}>01</div>
          <div className="selectedworks_counter_column" ref={r_counter2}>1234567890</div>
          <span>/10</span>
        </div>
      </Html>
    </BorderedPlane>
    <BorderedPlane // Sidebar
      width={width * 0.915 + 1/factor}
      height={height - width * 0.046 + 2/factor}
      factor={factor}
      position={new Vector3(-1/factor, -width * 0.023 + 1/factor, 0)}
      groupRef={r_sidebar}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="selectedworks_header"
        portal={{ current: scrollData.fixed }}
        zIndexRange={[1, 2]}
        ref={r_sidebarText}
        style={{
          width: width * 0.915 * factor,
          height: (height - width * 0.046) * factor
        }}
      >
        <h4>Selected<br/><span ref={r_sidebarTextSpan}><em>W</em>ORKS &copy;</span></h4>
      </Html>
    </BorderedPlane>
    {renderProjects()}
  </group>
}

export default SelectedWorks
