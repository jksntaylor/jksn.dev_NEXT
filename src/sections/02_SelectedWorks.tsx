// libraries
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { Html, useScroll, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useSinglePrismicDocument } from "@prismicio/react"
import gsap from 'gsap'
// modules
import { t_selectedWorksMaterial } from "../components/Materials"
import { ScreenContext } from '../components/Providers'
import ProjectPage from '../components/ProjectPage'
import { colors } from "../utils/constants"
import { t_project } from '../utils/types'
import { useMedia } from '../utils/hooks'
// assets
import '../styles/SelectedWorks.scss'

const SelectedWorks = () => {
  const scrollData = useScroll()
  const screen = useContext(ScreenContext)
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()

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
      'case_study.images',
      'case_study.project_description'
    ],
  })

  // Refs for animation
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_top = useRef<THREE.Group>(null!)
  const r_counter1 = useRef<HTMLDivElement>(null!)
  const r_counter2 = useRef<HTMLDivElement>(null!)
  const r_side = useRef<THREE.Group>(null!)
  const r_sidebar = useRef<THREE.Group>(null!)
  const r_sidebarText = useRef<HTMLDivElement>(null!)
  const r_sidebarTextSpan = useRef<HTMLSpanElement>(null!)
  const r_projects = useRef<THREE.Group>(null!)
  const r_projectsInner = useRef<HTMLDivElement>(null!)
  const r_projectsImages = useRef<THREE.Group & { children: (THREE.Mesh & { material: t_selectedWorksMaterial })[] }>(null!);

  const r_delta = useRef(0)
  const r_projectOpen = useRef(-1)

  const projectTL = useRef(gsap.timeline())

  const toggleProject = useCallback((i: number) => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && r_projectOpen.current !== -1) toggleProject(r_projectOpen.current)
    }

    const handleResize = () => {
      if (r_projectOpen.current !== -1) {
        setTimeout(() => {
          r_projectsImages.current.children[r_projectOpen.current].material.u_progress = 1
          r_projectsImages.current.children[r_projectOpen.current].position.setX(-width/2)
        }, 0);
      }
    }

    const container = document.querySelector('main > div > div > div') as HTMLDivElement

    if (r_projectOpen.current === i || i === -1) {
      // HIDE PROJECT PAGE
      container.style.overflow = 'hidden auto'
      window.dispatchEvent(new CustomEvent('hideProject'))
      projectTL.current.kill()
      projectTL.current = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => { r_projectOpen.current = -1 }
      }).to(r_projectsInner.current, {
        x: 0,
        duration: 1.85
      }, 1.5).to(r_top.current.position, {
        y: 0,
        duration: .5
      }, 1.7).to(r_side.current.position, {
        x: 0,
        duration: .85
      }, 1.9)

      const image = r_projectsImages.current.children[r_projectOpen.current] as THREE.Mesh & { material: t_selectedWorksMaterial }

      if (!screen.mobile) {
        gsap.to(image.position, {
          x: r_projectOpen.current % 2 ? -width * .3125 + width * .187 : width * .3125 - width * .187,
          duration: 2.15,
          ease: 'power2.inOut'
        })
      }

      gsap.to(image.material, {
        u_progress: 0,
        duration: 2.15,
        ease: 'power2.inOut'
      })

      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', (e: KeyboardEvent) => handleKey(e))
    } else {
      // SHOW PROJECT PAGE
      setTimeout(() => {
        r_projectOpen.current = i
        const topDistance = screen.mobile ? window.innerHeight * 3.9 + (window.innerHeight * .498 * i) : window.innerHeight * 2.6 + (window.innerHeight * 0.332 * i)

        container.scrollTo({ top: topDistance })
        window.dispatchEvent(new CustomEvent('showProject', { detail: { proj: home?.data.case_studies[i].case_study.data, i: i }}))

        projectTL.current.kill()
        projectTL.current = gsap.timeline().to(r_side.current.position, {
          x: -width * (.285 + .2 /* padding */),
          duration: .85,
          ease: 'expo.inOut'
        }).to(r_top.current.position, {
          y: width * (.046 + .5 /* padding */),
          duration: .5,
          ease: 'expo.inOut'
        }, .4).to(r_projectsInner.current, {
          x: screen.mobile ? width * factor : screen.desktop ? width * .915 * factor : (width - height * .16) * factor,
          duration: 1.85,
          ease: 'expo.inOut'
        }, .2)

        const image = r_projectsImages.current.children[i] as THREE.Mesh & { material: t_selectedWorksMaterial }

        if (!screen.mobile) {
          gsap.to(image.position, {
            x: -width / 2 - width * 0.05,
            duration: 2.15,
            ease: 'power2.inOut',
            delay: .5
          })
        }
        gsap.to(image.material, {
          u_progress: 1,
          duration: 2.15,
          ease: 'power2.inOut',
          delay: .5
        })

        container.style.overflow = 'hidden'
        window.addEventListener('resize', handleResize)
        window.addEventListener('keydown', (e: KeyboardEvent) => handleKey(e))
      }, 0);
    }
  }, [factor, width, height, home, screen.mobile, screen.desktop])

  const handleMenuClick = useCallback((i: number) => {
    if (r_projectOpen.current === i) return
    else if (r_projectOpen.current < 0) toggleProject(i)
    else {
      setTimeout(() => {
        if (home) window.dispatchEvent(new CustomEvent('swapProject', { detail: { prev: r_projectOpen.current, next: i, proj: home.data.case_studies[i].case_study.data }}))
      }, 10);
    }
  }, [toggleProject, home])

  useEffect(() => {
    window.addEventListener('toggleProject', ((e: CustomEvent) => toggleProject(e.detail)) as EventListener)
    window.addEventListener('handleMenuClick', ((e: CustomEvent) => handleMenuClick(e.detail)) as EventListener)
    return () => {
      window.removeEventListener('toggleProject', ((e: CustomEvent) => toggleProject(e.detail)) as EventListener)
      window.removeEventListener('handleMenuClick', ((e: CustomEvent) => handleMenuClick(e.detail)) as EventListener)
    }
  }, [toggleProject, handleMenuClick])

  // START IMAGE COMPONENT
  const imageSizes = useMedia({ w: height * .632, h: height * .75 }, { w: width * 0.374, h: width * .444 }, { w: width * .85, h: width * 1.009 })
  const imageOffset = useMedia(height * .92, height - width * .046, height - width * .35)

  const Image: React.FC<{url: string, index: number }> = ({ url, index }) => {
    const r_mat = useRef<t_selectedWorksMaterial>(null!)
    const r_mesh = useRef<THREE.Mesh>(null!)
    const texture = useTexture(url)

    const posX = useMedia((width - height * .96)/2 - height * 0.316, width * .1255, 0)

    useEffect(() => {
      if (r_mat.current.u_texture !== texture) r_mat.current.u_texture = texture
      r_mesh.current.position.set(index % 2 ? -posX : posX, -imageOffset * index, 0)
    }, [posX, index, texture])

    useFrame(() => { if(r_mat.current.u_delta !== r_delta.current) r_mat.current.u_delta = r_delta.current })

    return <mesh ref={r_mesh}>
      <planeGeometry args={[imageSizes.w , imageSizes.h, 48, 1]} />
      <selectedWorksMaterial ref={r_mat} u_zoom={(height / imageSizes.h) + .1}/>
    </mesh>
  } // END IMAGE COMPONENT

  const wrapperOffsets = useMedia(
    { start: width - height * .16, move: width - height * .08, end: width - height * .24 },
    { start: width * .915, move: width * .9575, end: width * .8725 },
    { start: width, move: width, end: width }
  )

  // sidebar is hidden on mobile so the zeros can stay, they're irrelevant
  const sidebarPosition = useMedia(height * .28, width * .135, 0)

  const sidebarWidths = useMedia(
    {initial: width - height * 0.56, end: height * 0.4 },
    { initial: width * .723, end: width * .183 },
    { initial: 0, end: 0 }
  )

  const fontSize1 = useMedia(
    { initial: '30.5vh', end: '9.5vh' },
    { initial: '19.75rem', end: '5.25rem' },
    { initial: '0px', end : '0px' }
  )

  const fontSize2 = useMedia(
    { initial: '28vh', end: '9vh' },
    { initial: '18.5rem', end: '5rem' },
    { initial: '0px', end : '0px'}
  )

  const projContainerHeight = useMedia(height * 0.92, height - width * .046, height - width * .35 + 2/factor) * 10 * factor
  const projContainerOffsetY = useMemo(() => ((projContainerHeight / 10) * 9) / factor, [projContainerHeight, factor])

  useFrame(() => {
    const sectionOffset = scrollData.range(.1784, .05)
    const sidebarOffset = scrollData.range(.2284, .025)
    const projectsOffset = scrollData.range(.26, .3)
    const counterOffset = scrollData.range(.525, .035) // just for counter first column (0 - 1)
    const sectionOffset2 = scrollData.range(.56, .05)

    if (sectionOffset === 0 && r_wrapper.current.position.x !== wrapperOffsets.move) {
      r_wrapper.current.position.x = wrapperOffsets.move
    } else if (sectionOffset > 0 && sectionOffset2 < 1 && scrollData.delta > 0) {
      // section horizontal movement
      r_wrapper.current.position.x = -wrapperOffsets.start * sectionOffset + wrapperOffsets.move - wrapperOffsets.start * sectionOffset2

      if (r_counter1.current) r_counter1.current.style.transform = `translateY(${counterOffset * -50}%)`
      if (r_counter2.current) r_counter2.current.style.transform = `translateY(${projectsOffset * -90}%)`

      if (!screen.mobile) {
        r_sidebar.current.position.x = (-width / 2 + sidebarPosition) * sidebarOffset
        r_sidebarText.current.style.width = `${(1 - sidebarOffset) * sidebarWidths.initial * factor + sidebarWidths.end * factor}px`
        r_sidebarText.current.style.fontSize = `calc(${(1 - sidebarOffset)} * ${fontSize1.initial} + ${fontSize1.end})`

        if (r_sidebarTextSpan.current) r_sidebarTextSpan.current.style.fontSize = `calc(${(1 - sidebarOffset)} * ${fontSize2.initial} + ${fontSize2.end})`
      }

      if (r_projects.current) { // project "scrolling"
        if (!screen.mobile) r_projects.current.position.x = (width * (1 - sidebarOffset) * .7125) + width * .1
        r_delta.current = (r_projects.current.position.y - (projectsOffset * projContainerOffsetY)) / 100
        r_projects.current.position.y = projectsOffset * projContainerOffsetY
      }
    } else if (sectionOffset2 === 1 && r_wrapper.current.position.x !== -wrapperOffsets.end) {
      r_wrapper.current.position.x = -wrapperOffsets.end
    }
  })

  return <group ref={r_wrapper} position={[wrapperOffsets.move, 0, 0]}>
    <group ref={r_top}>
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="selectedworks_top"
        position={[-1/factor, height / 2 - useMedia(height * 0.04, width * .023, width * .06) + 1/factor, 0]}
        portal={{ current: scrollData.fixed }}
        zIndexRange={[2, 3]}
        style={{
          width: useMedia(width - height * 0.16, width * .915, width) * factor,
          height: useMedia(height * .08, width * .046, width * .12) * factor,
          borderBottom: `1px solid ${colors.dirtyWhite}`
        }}
      >
        <div className='section_number' style={{ width: useMedia(height * 0.08, width * .046, width * .12) * factor }}>02</div>
        <div className="selectedworks_counter">
          {screen.mobile && <p>Selected Works</p>}
          <div className="selectedworks_counter-mask">
            <div className="selectedworks_counter_column" ref={r_counter1}>01</div>
            <div className="selectedworks_counter_column" ref={r_counter2}>1234567890</div>
            <span>/10</span>
          </div>
        </div>
      </Html>
    </group>
    <group ref={r_side} visible={!screen.mobile}>
      <group ref={r_sidebar} position={[-1/factor, useMedia(-height * 0.04, -width * .023, 0) + 1/factor, 0]}>
        <Html
          center
          // transform
          // distanceFactor={3.4}
          className="selectedworks_sidebar"
          portal={{ current: scrollData.fixed }}
          zIndexRange={[0, 1]}
          ref={r_sidebarText}
          style={{
            width: useMedia(width - height * .16, width * .915, 0) * factor,
            height: useMedia(height * .92, height - width * .046, 0) * factor
          }}
          >
          <p>Selected<br/><span ref={r_sidebarTextSpan}><em>W</em>ORKS &copy;</span></p>
        </Html>
      </group>
    </group>
    <group ref={r_projects} position= {[width * useMedia(.0575, .0575, 0), 0, 0]}>
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="selectedworks_projects"
        ref={r_projectsInner}
        portal={{ current: scrollData.fixed }}
        style={{ width: useMedia(width - height * 0.96, width * .625, width + 2/factor) * factor, height: projContainerHeight }}
        position={[0, -projContainerHeight/2/factor + height / 2 - useMedia(height * 0.08, width * .046, width * .12), 0]}
        zIndexRange={[0, 1]} >
        {home && home.data.case_studies.map((proj: { case_study: { data: t_project}}, i: number) => {
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
      <group position={[0, useMedia(-height * .04, -width * .023, width * .06), 0]} ref={r_projectsImages}>
        {home && home.data.case_studies.map((proj: { case_study: { data: t_project}}, i: number) => <Image url={proj.case_study.data.cover_image.url} key={i} index={i}/>)}
      </group>
    </group>
    <ProjectPage ref={r_projectsImages}/>
  </group>
}

export default SelectedWorks
