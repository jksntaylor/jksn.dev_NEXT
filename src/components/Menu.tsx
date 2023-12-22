// libraries
import { Html, useScroll } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"
import gsap from "gsap"
// modules
import BorderedPlane from "./BorderedPlane"
import { colors } from "../utils/constants"
import { scrollTo } from "../utils/functions"

const Menu = () => {
  const scrollData = useScroll()
  const { camera, viewport } = useThree()
  const { height, width, factor } = viewport.getCurrentViewport(camera, [0, 0, 0])

  const r_drawer = useRef<THREE.Group>(null!)

  const r_path1 = useRef<SVGPathElement>(null!)
  const r_path2 = useRef<SVGPathElement>(null!)
  const r_path2b = useRef<SVGPathElement>(null!)
  const r_path3 = useRef<SVGPathElement>(null!)

  const r_menuOpen = useRef(false)

  const menuTL = gsap.timeline({ paused: true })

  useEffect(() => {
    setTimeout(() => {
      menuTL.to([r_path1.current, r_path2.current, r_path3.current], {
        strokeDashoffset: "+=100%",
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.inOut'
      }).to(r_path1.current, {
        y: '200%',
        opacity: 0,
        duration: 0.5
      }, 0.5).to(r_path3.current, {
        y: '-200%',
        opacity: 0,
        duration: 0.5
      }, 0.5).to(r_path2.current, {
        strokeDasharray: '100% 0%',
        duration: 0.5
      }, 0.5).to(r_path2b.current, {
        opacity: 1,
        duration: 0.5
      }, 0.5).to(r_path2.current, {
        rotate: -75,
        scaleX: 1.2,
        duration: 0.75,
        transformOrigin: 'center',
        ease: 'expo.inOut'
      }, 0.75).to(r_path2b.current, {
        rotate: -165,
        scaleX: 1.2,
        duration: 0.75,
        transformOrigin: 'center',
        ease: 'expo.inOut'
      }, 0.75).to(r_drawer.current.position, {
        x: width * 0.0275,
        duration: 0.75,
        ease: 'expo.inOut'
      }, 0.75)
    }, 50);

  }, [menuTL, factor, width])

  const handleEscape = (e: KeyboardEvent) => {
    if (r_menuOpen.current) {
      e.preventDefault()
      if (e.key === 'Escape') toggleMenu()
    }
  }

  const toggleMenu = () => {
    const container = document.querySelector('main > div > div > div') as HTMLDivElement
    if (!r_menuOpen.current) {
      container.style.overflow = 'hidden'
      menuTL.play()
      window.addEventListener('keydown', e => handleEscape(e))
    } else {
      container.style.overflow = 'hidden auto'
      menuTL.reverse()
      window.removeEventListener('keydown', e => handleEscape(e))
    }
    r_menuOpen.current = !r_menuOpen.current
  }

  const mouseEnter = () => {
    if (!r_menuOpen.current) menuTL.tweenTo(0.5)
  }

  const mouseLeave = () => {
    if (!r_menuOpen.current) menuTL.tweenTo(0)
  }

  const handleLinkClick = (index: number) => {
    console.log(index)
    scrollTo(window.innerHeight * (2.6 + index * 0.33))
    toggleMenu()
  }

  return <group>
    <BorderedPlane
      width={width * 0.94 + 8/factor}
      height={height}
      factor={factor}
      position={new Vector3(-width * 0.94 + width * 0.055 - 4/factor, 0, 0)}
      groupRef={r_drawer}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="menu_drawer"
        zIndexRange={[8, 9]}
        portal={{ current: scrollData.fixed }}
        style={{
          width: width * 0.94 * factor + 8,
          height: height * factor
        }}
      >
        <div className="menu_links">
          <h3 onClick={() => handleLinkClick(9)}>something</h3>
        </div>
        <h4>
          <span>Available for Freelance</span>
          <span>JACKSON TAYLOR</span>
          <span>January 2024</span>
        </h4>
      </Html>
    </BorderedPlane>
    <BorderedPlane
      height={height}
      width={width * 0.055 + 4/factor}
      factor={factor}
      position={new Vector3(-width/2 + width * 0.03 - 2/factor, 0, 0.002)}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="menu"
        zIndexRange={[10, 11]}
        portal={{ current: scrollData.fixed }}
        style={{
          width: width * 0.055 * factor + 8,
          height: height * factor,
        }}
      >
        <svg onClick={toggleMenu} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} x="0" y="0" width="41" height="44" viewBox="0 0 41 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path ref={r_path1} d="M1.4 01.5L40 12" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="20%"/>
          <path ref={r_path2} d="M1.4 16.5L40 27" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="40%"/>
          <path ref={r_path2b} d="M1.4 16.5L40 27" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="100% 0%" strokeDashoffset="50%" opacity={0}/>
          <path ref={r_path3} d="M1.4 31.5L40 42" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="60%"/>
        </svg>
      </Html>
    </BorderedPlane>
  </group>
}


export default Menu
