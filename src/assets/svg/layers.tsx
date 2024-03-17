import gsap from "gsap";
import { useRef, useState } from "react";
import { colors } from "../../utils/constants";
import { useStore } from "../../utils/hooks";

const LayersSVG = () => {
  const r_rect1 = useRef<SVGRectElement>(null!)
  const r_rect3 = useRef<SVGRectElement>(null!)
  const [disabled, setDisabled] = useState(false)

  const mouseEnter = () => {
    gsap.to(r_rect1.current, { x: '1px', y: '3px', scale: 0.8, filter: 'blur(2px)' })
    gsap.to(r_rect3.current, { x: '3px', y: '-7px', scale: 1.2, filter: 'blur(2px)' })
  }

  const mouseLeave = () => {
    gsap.to([r_rect1.current, r_rect3.current], { x: 0, y: 0, scale: 1, filter: 'blur(0px)', stagger: 0 })
  }

  const setView3D = useStore((state) => state.setView3D)

  const toggleLayers = () => {
    if (!disabled) {
      setDisabled(true)
      setView3D()
      setTimeout(() => {
        setDisabled(false)
      }, 400);
    }
  }


  return <svg aria-disabled={disabled} width="40" height="34" viewBox="0 0 40 34" fill="none" className="menu__layers" xmlns="http://www.w3.org/2000/svg"onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onClick={toggleLayers}>
    <rect ref={r_rect1} x="1" y="13" width="26" height="20" fill={colors.fadedBlack} stroke={colors.dirtyWhite} strokeWidth="2"/>
    <rect x="7" y="7" width="26" height="20" fill={colors.fadedBlack} stroke={colors.dirtyWhite} strokeWidth="2"/>
    <rect ref={r_rect3} x="13" y="1" width="26" height="20" fill={colors.fadedBlack} stroke={colors.dirtyWhite} strokeWidth="2"/>
  </svg>
}

export default LayersSVG
