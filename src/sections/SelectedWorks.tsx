// libraries
import { useSinglePrismicDocument } from "@prismicio/react"
import { Html, useScroll, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef } from 'react'
import { Vector3 } from "three"
import gsap from 'gsap'
// modules
import { t_SelectedWorksMaterial } from "../components/Materials"
import BorderedPlane from "../components/BorderedPlane"
import { colors } from "../utils/constants"

const SelectedWorks = () => {
  const scrollData = useScroll()

  const [home] = useSinglePrismicDocument('homepage', {
    fetchLinks: [
      'case_study.cover_image',
      'case_study.awards',
      'case_study.project_title',
      'case_study.project_link',
      'case_study.project_link_text',
      'case_study.year',
      'case_study.role',
      'case_study.client1',
      'case_study.client2',
      'case_study.images'
    ]
  })

  type t_project = {
    case_study: {
      data: {
        cover_image: { url: string }
        awards: { award?: string }[]
        project_title: { text: string }[]
        project_link: { url: string }
        project_link_text: string
        year: string
        role: string
        client1: string
        client2?: string
        images: { url: string }[]
      }
    }
  }

  const { viewport } = useThree()
  const { factor } = viewport
  const { width, height } = viewport.getCurrentViewport()

  const r_wrapper = useRef<THREE.Group>(null!)
  const r_top = useRef<THREE.Group>(null!)
  const r_side = useRef<THREE.Group>(null!)
  const r_counter1 = useRef<HTMLDivElement>(null!)
  const r_counter2 = useRef<HTMLDivElement>(null!)
  const r_sidebar = useRef<THREE.Group & { children: [THREE.Mesh, THREE.Mesh] }>(null!)
  const r_sidebarText = useRef<HTMLDivElement>(null!)
  const r_sidebarTextSpan = useRef<HTMLSpanElement>(null!)
  const r_projects = useRef<THREE.Group>(null!)
  const r_projectsInner = useRef<HTMLDivElement>(null!)
  const r_projectsImages = useRef<THREE.Group>(null!)

  const r_projectPage = useRef<HTMLDivElement>(null!)

  const r_delta = useRef(0)
  const r_projectOpen = useRef(-1)

  const projContainerHeight = (height - width * 0.046) * 10 * factor
  const projContainerOffsetY = ((projContainerHeight / 10) * 9) / factor

  const projectTL = gsap.timeline({ paused: true })


  const toggleProject = useCallback((i: number) => {

    const handleEscape = (e: KeyboardEvent) => {
      if (r_projectOpen.current > -1) {
        e.preventDefault()
        if (e.key === 'Escape') toggleProject(r_projectOpen.current)
      }
    }

    const container = document.querySelector('main > div > div > div') as HTMLDivElement
    const image = r_projectsImages.current.children[i] as THREE.Mesh & { material: t_SelectedWorksMaterial }

    if (r_projectOpen.current === i) {
      r_projectOpen.current = -1
      container.style.overflow = 'hidden auto'

      gsap.to(image.position, {
        x: i % 2 ? -width * 0.3125 + width * 0.187 : width * 0.3125 - width * 0.187,
        duration: 2,
        ease: 'power2.inOut'
      })
      gsap.to(image.material, {
        u_progress: 0,
        duration: 2,
        ease: 'power1.inOut'
      })

      setTimeout(() => { projectTL.reverse() }, 1000);

      window.removeEventListener('keydown', (e: KeyboardEvent) => handleEscape(e))
    } else {
      r_projectOpen.current = i
      container.scrollTo({ top: window.innerHeight * (2.6 + i * 0.33) })
      projectTL.play()
      image.material.u_zoom = height / (width * 0.444) + 0.05
      gsap.to(image.position, {
        x: -width / 2,
        duration: 2,
        ease: 'power2.inOut'
      })
      gsap.to(image.material, {
        u_progress: 1,
        duration: 2,
        ease: 'power1.inOut'
      })
      container.style.overflow = 'hidden'
      window.addEventListener('keydown', (e: KeyboardEvent) => handleEscape(e))
    }
  }, [projectTL, height, width])

  useEffect(() => {
    setTimeout(() => {
      projectTL.to(r_side.current.position, {
        x: -width * 0.285,
        duration: 0.8,
        ease: 'expo.inOut'
      }).to(r_top.current.position, {
        y: width * 0.046,
        duration: 0.5,
        ease: 'expo.inOut'
      }, 0.3).to(r_projectsInner.current, {
        x: width * 0.915 * factor,
        duration: 1,
        ease: 'expo.inOut'
      }, 0.1)
    }, 50);

    window.addEventListener('toggleProject', ((e: CustomEvent) => toggleProject(e.detail)) as EventListener)
    return () => window.removeEventListener('toggleProject', ((e: CustomEvent) => toggleProject(e.detail)) as EventListener)
  }, [toggleProject, projectTL, width, factor])

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
        ref={r_projectsInner}
        portal={{ current: scrollData.fixed }}
        style={{ width: width * 0.625 * factor, height: projContainerHeight }}
        position={[0, -projContainerHeight/factor/2 + (height - width * 0.046)/4, 0]}
        zIndexRange={[0, 100]} >
        {home && home.data.case_studies.map((proj: t_project, i: number) => {
          const { awards, client1, client2, year, role, project_link, project_link_text, project_title } = proj.case_study.data
          return <div className={`selectedworks_project selectedworks_project-${i%2?'right':'left'}`} key={i}>
            {awards[1] && <div className="selectedworks_project_awards">
              {awards.map((award, i: number) => <span key={i}>★&nbsp;{award.award}&nbsp;★</span>)}
            </div>}
            <div className="selectedworks_project_info">
              <span>{year}<br/>{client1}<br/>{client2 && client2}</span>
              <span>{role}<br/><a href={project_link.url} target='_blank' rel='noopener noreferrer'>{project_link_text}</a></span>
            </div>
            <h3 className="selectedworks_project_title" dangerouslySetInnerHTML={{ __html: project_title[0].text}}/>
            <button className="selectedworks_project_button" onClick={() => toggleProject(i)}>Vie<em>w</em> Project →</button>
          </div>
        })}
      </Html>
      <group position={[0, 0, 0]} ref={r_projectsImages}>
        {home && home.data.case_studies.map((proj: t_project, i: number) => { // extract into component (<SelectedWorksImage url={url}/>)
          const posX = i % 2 ? -width * 0.3125 + width * 0.187 : width * 0.3125 - width * 0.187
          return <Image url={proj.case_study.data.cover_image.url} position={new Vector3(posX, (height - width * 0.046) * -i, 0)} key={i}/>
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

    if (sectionOffset === 0 && r_wrapper.current.position.x !== width * 0.9575) {
      r_wrapper.current.position.x = width * 0.9575
    } else if (sectionOffset > 0 && sectionOffset2 < 1) {
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
        r_delta.current = (r_projects.current.position.y - (projectsOffset * projContainerOffsetY)) / 100
        r_projects.current.position.y = projectsOffset * projContainerOffsetY
      }
    } else if (sectionOffset2 === 1 && r_wrapper.current.position.x !== -width * 0.8725) {
      r_wrapper.current.position.x = -width * 0.8725
    }
  })

  return <group ref={r_wrapper} position={[width * 0.9575, 0, 0]}>
    <group ref={r_top}>
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
    </group>
    <group ref={r_side}>
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
          className="selectedworks_sidebar"
          portal={{ current: scrollData.fixed }}
          zIndexRange={[1, 2]}
          ref={r_sidebarText}
          style={{ width: width * 0.915 * factor, height: (height - width * 0.046) * factor }}
        >
          <h4>Selected<br/><span ref={r_sidebarTextSpan}><em>W</em>ORKS &copy;</span></h4>
        </Html>
      </BorderedPlane>
    </group>
    {renderProjects()}
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[7, 8]}
      portal={{ current: scrollData.fixed }}
      ref={r_projectPage}
    >

    </Html>
  </group>
}

export default SelectedWorks
