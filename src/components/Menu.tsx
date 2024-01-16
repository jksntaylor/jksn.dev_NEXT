// libraries
import { Html, useScroll } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef } from "react"
import { Vector3 } from "three"
import gsap from "gsap"
// modules
import BorderedPlane from "./BorderedPlane"
import { colors } from "../utils/constants"
import { lerp } from "../utils/functions"
// assets
import Star from "../assets/images/star"

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

  const menuTL = useRef(gsap.timeline({ paused: true }))

  const toggleMenu = useCallback(() => {
    const container = document.querySelector('main > div > div > div') as HTMLDivElement
    if (!r_menuOpen.current) {
      container.style.overflow = 'hidden'
      menuTL.current.play()
    } else {
      container.style.overflow = 'hidden auto'
      menuTL.current.reverse()
    }
    r_menuOpen.current = !r_menuOpen.current
  }, [])

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (r_menuOpen.current && e.key === 'Escape') {
      e.stopImmediatePropagation()
      toggleMenu()
    }
  }, [toggleMenu])

  useEffect(() => {
    setTimeout(() => {
      menuTL.current.to([r_path1.current, r_path2.current, r_path3.current], {
        strokeDashoffset: "+=100%",
        stagger: 0.1,
        duration: 0.35,
        ease: 'power2.inOut'
      }).to(r_path1.current, {
        y: '200%',
        opacity: 0,
        duration: 0.5
      }, 0.6).to(r_path3.current, {
        y: '-200%',
        opacity: 0,
        duration: 0.5
      }, 0.6).to(r_path2.current, {
        strokeDasharray: '100% 0%',
        duration: 0.5
      }, 0.6).to(r_path2b.current, {
        opacity: 1,
        duration: 0.5
      }, 0.6).to(r_path2.current, {
        rotate: -75,
        scaleX: 1.2,
        duration: 0.75,
        transformOrigin: 'center',
        ease: 'expo.inOut'
      }, 0.85).to(r_path2b.current, {
        rotate: -165,
        scaleX: 1.2,
        duration: 0.75,
        transformOrigin: 'center',
        ease: 'expo.inOut'
      }, 0.85).to(r_drawer.current.position, {
        x: width * 0.0275,
        duration: 0.75,
        ease: 'expo.inOut'
      }, 0.85)
    }, 500);
      window.addEventListener('keydown', e => handleEscape(e))
    return () => {
      window.removeEventListener('keydown', e => handleEscape(e))
    }
  }, [menuTL, factor, width, handleEscape])

  const mouseEnter = () => {
    if (!r_menuOpen.current) menuTL.current.tweenTo(0.55)
  }

  const mouseLeave = () => {
    if (!r_menuOpen.current) menuTL.current.tweenTo(0)
  }

  const handleLinkClick = (index: number) => {
    window.dispatchEvent(new CustomEvent('handleMenuClick', { detail: index }))
    toggleMenu()
  }

  // START MenuLink COMPONENT
  const MenuLink: React.FC<{
    str: string,
    projIndex: number,
    altColor?: boolean
  }> = ({str, projIndex, altColor }) => {

    const r_link = useRef<HTMLDivElement>(null!)
    const r_cursor = useRef({ target: 0, value: 0 })
    const r_chars: { el: HTMLSpanElement, pos: number }[] = []
    const r_intensity = useRef({ value: 0 })

    const intensityTL = gsap.timeline({ paused: true }).to(r_intensity.current, { value: 1, duration: 0.35 })

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      intensityTL.play()
      const rect = r_link.current.getBoundingClientRect()
      r_cursor.current.value = (e.clientX - rect.left) / rect.width
    }

    const handleMouseLeave = () => {
      intensityTL.reverse()
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = r_link.current.getBoundingClientRect()
      r_cursor.current.target = (e.clientX - rect.left) / rect.width
    }

    const Character: React.FC<{char: string}> = ({char}) => {
      const r_span = useRef<HTMLSpanElement>(null!)
      useEffect(() => {
        const rect = r_link.current.getBoundingClientRect()
        r_chars.push({
          el: r_span.current,
          pos: (r_span.current.getBoundingClientRect().x - rect.left) / rect.width,
        })
      }, [])
      return <span style={{ display: 'inline-block', transformOrigin: 'bottom'}} ref={r_span}>
        {char.match(/[A-Z07]/g) ? <em>{char}</em> : char}
      </span>
    }

    const generateString = (str: string) => str.split('').map((c, i) => <Character char={c} key={i}/>)

    const animate = () => {
      if (r_cursor.current.target !== r_cursor.current.value) r_cursor.current.value = lerp(r_cursor.current.value, r_cursor.current.target, 0.1)
      r_chars.forEach(char => {
        if (r_intensity.current.value > 0) {
            const strength = (0.75 - Math.min(Math.max(Math.abs(char.pos - r_cursor.current.value) * 3, 0), 0.75)) * r_intensity.current.value
            char.el.style.transform = `
              scale(${char.el.innerHTML === 'i' || char.el.innerHTML === "'" ? 1 + strength : 1}, ${1 + strength / 2})
              translateY(${strength * 15}%)
            `
            char.el.style.color = `color-mix(in srgb, ${altColor ? colors.darkModeAccent : colors.darkModeAccent_2} ${strength * 250}%, ${colors.dirtyWhite})`
            if (char.el.innerHTML !== 'i' && char.el.innerHTML !== "&nbsp;") char.el.style.fontWeight = `${200 + strength * 600}`
          } else if (char.el.style.fontWeight !== '200') {
            char.el.style.transform = `scale(1) translateY(0)`
            char.el.style.color = colors.dirtyWhite
            char.el.style.fontWeight = '200'
          }
      })
      requestAnimationFrame(animate)
    }

    useEffect(() => {
      animate()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div
      ref={r_link}
      className="menu_link"
      onMouseEnter={e => handleMouseEnter(e)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={e => handleMouseMove(e)}
      onClick={() => handleLinkClick(projIndex)}
    >
      {generateString(str)}
    </div>
  }
  // END MenuLink COMPONENT

  return <group>
    <BorderedPlane
      width={width * 0.945}
      height={height}
      factor={factor}
      position={new Vector3(-width * 0.915 + width * 0.03, 0, 0)}
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
          width: width * 0.945 * factor,
          height: height * factor + 4
        }}
      >
        <div className="menu_links">
          <div className="menu_links-projects">
            <span>PROJECTS<hr/></span>
            <div className="menu_links-flex">
              <MenuLink projIndex={0} str="tiKtok&nbsp;tOp&nbsp;moMents"/>
              <MenuLink projIndex={1} str="Rre&nbsp;ventUreS" altColor/>
              <MenuLink projIndex={2} str="gEnieS"/>
              <MenuLink projIndex={3} str="reaLtiMe&nbsp;roBoTics" altColor/>
              <MenuLink projIndex={4} str="leVi's&nbsp;501&nbsp;Day"/>
              <MenuLink projIndex={5} str="soURce&nbsp;7" altColor/>
              <MenuLink projIndex={6} str="huGe&nbsp;iNc"/>
              <MenuLink projIndex={7} str="BitsKi" altColor/>
              <MenuLink projIndex={8} str="bRaiNBasE"/>
              <MenuLink projIndex={9} str="iNtrOvOke" altColor/>
            </div>
          </div>
          <div className="menu_links-experiments">
            <span>EXPERIMENTS<hr/></span>
            <div className="menu_links-flex">
              <MenuLink projIndex={0} str="GRanD&nbsp;PriX" altColor/>
              <MenuLink projIndex={1} str="DisTOrtioN" />
              <MenuLink projIndex={2} str="WatEr&nbsp;RiPplEs" altColor/>
              <MenuLink projIndex={3} str="CaR&nbsp;CatWalK" />
              <MenuLink projIndex={4} str="POrtaL" altColor/>
            </div>
          </div>
        </div>
        <div className="menu_teaser">
          <Star />
          <div>
            <span>Available for Freelance</span>
            <span>JACKSON TAYLOR</span>
            <span>February 2024</span>
          </div>
          <Star />
        </div>
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
