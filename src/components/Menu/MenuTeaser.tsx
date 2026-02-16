import { useRef } from "react"
import { useThree } from "@react-three/fiber"
import { Html, useScroll } from "@react-three/drei"
import gsap from 'gsap'

import { colors } from "../../utils/constants"
import { useMedia } from "../../utils/hooks"

const MenuTeaser: React.FC<{}> = () => {
  const r_path1 = useRef<SVGPathElement>(null!)
  const r_path2 = useRef<SVGPathElement>(null!)
  const r_path2b = useRef<SVGPathElement>(null!)
  const r_path3 = useRef<SVGPathElement>(null!)
  
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()

  const teaser = {
    x: useMedia(-width / 2 + height * 0.05, -width / 2 + width * 0.025, 0),
    y: useMedia(0, 0, -height / 2 * 0.075),
    width: useMedia(height * 0.1, width * 0.05, width) * factor,
    height: useMedia(height, height, width * 0.15) * factor
  }

  const mouseEnter = () => {
    gsap.to([r_path1.current, r_path2.current, r_path3.current], {
      strokeDashoffset: "+=100%",
      stagger: 0.1,
      duration: 0.35,
      ease: 'power3.inOut'
    })
  }

  const mouseLeave = () => {
    gsap.to(r_path1.current, {
      strokeDashoffset: '20%',
      duration: 0.35,
      delay: 0.2,
      ease: 'power2.inOut'
    })
    gsap.to(r_path2.current, {
      strokeDashoffset: '40%',
      duration: 0.35,
      delay: 0.1,
      ease: 'power2.inOut'
    })
    gsap.to(r_path3.current, {
      strokeDashoffset: '60%',
      duration: 0.35,
      ease: 'power2.inOut'
    })
  }

  return <group>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[35, 36]}
      portal={{ current: scrollData.fixed }}
      position={[teaser.x, teaser.y, 0]}
      style={{
        width: teaser.width,
        height: teaser.height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: `1px solid ${colors.dirtyWhite}`,
        background: `${colors.fadedBlack}`
      }}
    >
      <svg
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        x="0" y="0"
        width="41"
        height="44"
        viewBox="0 0 41 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          cursor: 'pointer',
          boxSizing: 'content-box'
        }}
      >
          <path ref={r_path1} d="M1.4 01.5L40 12" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="20%"/>
          <path ref={r_path2} d="M1.4 16.5L40 27" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="40%"/>
          <path ref={r_path2b} d="M1.4 16.5L40 27" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="100% 0%" strokeDashoffset="50%" opacity={0}/>
          <path ref={r_path3} d="M1.4 31.5L40 42" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="60%"/>
        </svg>
    </Html>
  </group>
}

export default MenuTeaser