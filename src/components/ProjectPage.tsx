// libraries
import { Html, useScroll } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { forwardRef, useCallback, useEffect, useRef } from "react"
import gsap from "gsap"
// modules
import { t_project, t_projectImages } from "../utils/types"
import { t_SelectedWorksMaterial } from "./Materials"

const ProjectPage = forwardRef<t_projectImages>((_, ref) => {
  const r_wrapper = useRef<HTMLDivElement>(null!)
  const r_title0 = useRef<HTMLSpanElement>(null!)
  const r_title1 = useRef<HTMLSpanElement>(null!)
  const r_role = useRef<HTMLSpanElement>(null!)
  const r_link = useRef<HTMLAnchorElement>(null!)
  const r_clients = useRef<HTMLSpanElement>(null!)
  const r_year = useRef<HTMLSpanElement>(null!)
  const r_description = useRef<HTMLParagraphElement>(null!)
  const r_visit = useRef<HTMLAnchorElement>(null!)
  const r_carousel = useRef<HTMLDivElement & { children: HTMLImageElement[] }>(null!)
  const r_carouselIndex = useRef(0)
  const r_projIndex = useRef(-1)

  const scrollData = useScroll()

  const tl = useRef(gsap.timeline())

  const { height, width, factor } = useThree().viewport.getCurrentViewport()

  const moveCarousel = (direction: 'left' | 'right') => {
    console.log('direction', r_carouselIndex.current)
    if (direction === 'right' && r_carouselIndex.current < 3 /* # of proj images - 1 */) {
      r_carouselIndex.current += 1
    } else if (direction === 'left' && r_carouselIndex.current > 0) {
      r_carouselIndex.current -= 1
    }
    gsap.to(r_carousel.current, {
      x: `-${65 * r_carouselIndex.current}rem`,
      ease: 'expo.out',
      duration: 2,
    })
  }

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') moveCarousel('left')
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') moveCarousel('right')
  }, [])

  const changeContent = (proj: t_project) => {
    const {
      project_title, project_link, project_link_text,
      client1, client2, role, year,
      project_description, images
    } = proj

    r_title0.current.innerText = project_title[0].text.split('<br/>')[0]
    r_title1.current.innerHTML = project_title[0].text.split('<br/>')[1].slice(6, length - 7)
    r_link.current.href = project_link.url
    r_visit.current.href = project_link.url
    r_link.current.innerText = project_link_text
    r_clients.current.innerText = `${client1} ${client2? `, ${client2}` : ''}`
    r_role.current.innerText = role
    r_year.current.innerText = year
    if (project_description) r_description.current.innerText = project_description

    r_carouselIndex.current = 0
    gsap.set(r_carousel.current, {
      x: 0
    })
    for (let i = 0; i < 4; i++) {
      if (images[i] && images[i].project_image.url) {
        r_carousel.current.children[i].src = images[i].project_image.url
        r_carousel.current.children[i].style.visibility = 'inherit'
      } else {
        r_carousel.current.children[i].src = ''
        r_carousel.current.children[i].style.visibility = 'hidden'
      }
    }
  }

  const showProject = useCallback((details: { proj: t_project, i: number}) => {
    r_projIndex.current = details.i
    if (details.proj) {
      gsap.set(r_wrapper.current, { visibility: 'visible' })
      // set dynamic content
      changeContent(details.proj)
      // animate content in
      tl.current.kill()
      tl.current = gsap.timeline({ defaults: { ease: 'expo.out' }}).to('.projectpage_back', {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.25,
      }, 1.35).to('.projectpage h3 span', {
        y: 0,
        duration: 0.85,
        stagger: 0.15,
      }, 1.35).to('.projectpage_info > div > *', {
        y: 0,
        duration: 0.35,
        stagger: 0.05
      }, 1.95).to(r_description.current, {
        y: 0,
        opacity: 1,
        duration: 0.85
      }, 2.15).to(r_carousel.current.children, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5
      }, 2.2).to('.projectpage_carousel_nav', {
        y: 0,
        opacity: 1,
        duration: 0.35
      }, 2.3).to(r_visit.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.85
      }, 2.4)
    }
  }, [])

  const hideProject = () => {
    // animate content out
    tl.current.kill()
    tl.current = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        gsap.set(r_wrapper.current, { visibility: 'hidden' })
        r_projIndex.current = -1
      }
    }).to('.projectpage_back', {
      y: '50%',
      scale: 0.8,
      opacity: 0,
      duration: 0.85
    }).to([r_title0.current, r_title1.current], {
      y: '110%',
      duration: 0.85,
      stagger: 0.2
    }, 0).to('.projectpage_info > div > *', {
      y: '2rem',
      duration: 0.35,
      stagger: 0.05
    }, 0.6).to(r_description.current, {
      y: '50%',
      opacity: 0,
      duration: 0.85
    }, 0.8).to(r_carousel.current.children, {
      y: '30%',
      opacity: 0,
      stagger: 0.05,
      duration: 0.5
    }, 1.05).to('.projectpage_carousel_nav', {
      y: '50%',
      opacity: 0,
      duration: 0.35
    }, 1.15).to(r_visit.current, {
      y: '50%',
      scale: 0.8,
      opacity: 0,
      duration: 0.85
    }, 1.25)
  }

  // used in menu component
  const swapProject = useCallback((indices: { prev: number, next: number, proj: t_project }) => {
    tl.current.kill()
    tl.current = gsap.timeline({ defaults: { ease: 'power3.out' }})

    // scrollTo next index
    const container = document.querySelector('main > div > div > div') as HTMLDivElement
    container.scrollTo({ top: window.innerHeight * (2.6 + indices.next * 0.332) })
    // content switch
    setTimeout(() => {
      changeContent(indices.proj)
      r_projIndex.current = indices.next
    }, 1100); // timed for animation

    // @ts-expect-error undefined
    const prevImage = ref.current.children[indices.prev] as THREE.Mesh & { material: t_SelectedWorksMaterial }
    // @ts-expect-error undefined
    const nextImage = ref.current.children[indices.next] as THREE.Mesh & { material: t_SelectedWorksMaterial }

    // zoom image out
    tl.current.to(prevImage.position, {
      x: indices.prev % 2 ? -width * 0.3125 + width * 0.187 : width * 0.3125 - width * 0.187,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0).to(prevImage.material, {
      u_progress: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0).to([r_title0.current, r_title1.current], {
      y: '110%',
      duration: 0.5,
      stagger: 0.1
    }, 0).to('.projectpage_info > div > *', {
      y: '2rem',
      duration: 0.25,
      stagger: 0.05
    }, 0.4).to(r_description.current, {
      y: '50%',
      opacity: 0,
      duration: 0.5
    }, 0.5).to(r_carousel.current.children, {
      y: '30%',
      opacity: 0,
      stagger: 0.1,
      duration: 0.5
    }, 0.6).to(nextImage.position, {
      x: -width / 2,
      duration: 2.15,
      ease: 'power2.inOut'
    }, 1).to(nextImage.material, {
      u_progress: 1,
      duration: 2.15,
      ease: 'power2.inOut'
    }, 1).to([r_title0.current, r_title1.current], {
      y: 0,
      duration: 0.5,
      stagger: 0.1
    }, 1.3).to('.projectpage_info > div > *', {
      y: 0,
      duration: 0.35,
      stagger: 0.05
    }, 1.5).to(r_description.current, {
      y: 0,
      opacity: 1,
      duration: 0.85
    }, 1.7).to(r_carousel.current.children, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.85
    }, 1.9)
  }, [ref, width])


  useEffect(() => {
    window.addEventListener('swapProject', ((e: CustomEvent) => swapProject(e.detail)) as EventListener)
    window.addEventListener('showProject', ((e: CustomEvent) => showProject(e.detail)) as EventListener)
    window.addEventListener('keydown', (e: KeyboardEvent) => handleKey(e))
    window.addEventListener('hideProject', hideProject)
    return () => {
      window.removeEventListener('swapProject', ((e: CustomEvent) => swapProject(e.detail)) as EventListener)
      window.removeEventListener('showProject', ((e: CustomEvent) => showProject(e.detail)) as EventListener)
      window.removeEventListener('keydown', (e: KeyboardEvent) => handleKey(e))
      window.removeEventListener('hideProject', hideProject)
    }
  }, [showProject, swapProject, handleKey])

  return <group>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[7, 8]}
      className="projectpage"
      ref={r_wrapper}
      portal={{ current: scrollData.fixed }}
      style={{
        height: height * factor,
        width: width * 0.915 * factor,
        pointerEvents: 'none',
        visibility: 'hidden'
      }}
    >
      <button className="projectpage_back" onClick={() => window.dispatchEvent(new CustomEvent('toggleProject', { detail: r_projIndex.current }))}>
        ← <em>B</em>AC<em>K</em>
      </button>
      <div className="projectpage_top">
        <h3>
          <div><span ref={r_title0} /></div>
          <div><span ref={r_title1} /></div>
        </h3>
        <div className="projectpage_info">
          <div>
            <span>Role:</span><span ref={r_role}/>
          </div>
          <div>
            <span>Link:</span><a ref={r_link} href="/"/>
          </div>
          <div>
            <span>Clients:</span><span ref={r_clients}/>
          </div>
          <div>
            <span>Year:</span><span ref={r_year}/>
          </div>
        </div>
        <p ref={r_description}/>
      </div>
      <div className="projectpage_carousel" ref={r_carousel}>
        <img />
        <img />
        <img />
        <img />
      </div>
      <div className="projectpage_carousel_nav">
        <button onClick={() => moveCarousel('left')}>←</button>
        <button onClick={() => moveCarousel('right')}>→</button>
      </div>
      <a className="projectpage_visit" ref={r_visit} href="/" target='_blank' rel='noopener noreferrer'>VI<em>S</em>IT S<em>ITE</em> →</a>
    </Html>
  </group>
})

export default ProjectPage
