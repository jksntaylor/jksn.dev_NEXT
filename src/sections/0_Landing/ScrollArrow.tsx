import { useContext, useMemo, useRef } from "react"
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { Group } from "three"
import { useMedia } from "../../utils/hooks"
import LandingArrow from '../../assets/svg/landing-arrow.tsx'
import { ScreenContext } from "../../components/Providers"

const ScrollArrow: React.FC<{}> = () => {
  const screen = useContext(ScreenContext)
  const scrollData = useScroll()

  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()

  const r_arrow = useRef<Group>(null!)
  const r_arrowOuter = useRef<HTMLDivElement>(null!)
  const r_arrowInner = useRef<SVGGElement>(null!)

  const arrowSize = useMedia(width * 0.1, width * 0.1, width * 0.3)
  const arrowPadding = useMedia([width * 0.065, width * 0.065], [width * 0.14, width * 0.01], [width * 0.2, width * 0.2])
  const arrowOffset = useMedia([width * 0.05, height * 0.7], [width * 0.0, height * 0.7], [0, height - width * .7])

  // memoized sizes
  const menuWidth = useMemo(() => {
    return screen.fullWidth ? width * 0.1 : screen.desktop ? width * 0.055 + 8/factor : width
  }, [screen, width, factor])

  useFrame(() => {
    if (!r_arrow.current || !r_arrowInner.current) return;
    
    const sliceOffset = scrollData.range(0.01, 0.06)

    r_arrowInner.current.style.transform = `${screen.mobile ? 'rotate(90deg)' : ''} scale(${Math.min(sliceOffset + 1, 1.4)}) `
    if (r_arrowInner.current.parentElement) r_arrowInner.current.parentElement.style.transform = `rotate(${-360 * sliceOffset}deg)`

    r_arrow.current.position.x = width / 2 - arrowPadding[0] - arrowOffset[0] * sliceOffset
    r_arrow.current.position.y = height / 2 - arrowPadding[1] - arrowOffset[1] * sliceOffset
    r_arrowOuter.current.style.transform = `scale(${(sliceOffset * 0.6)  + 1})`
  })

  return <group ref={r_arrow} position={[width / 2 - (menuWidth / 2) - arrowPadding[0], height/2 - arrowPadding[1], 0]}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[14, 15]}
      portal={{ current: scrollData.fixed }}
      ref={r_arrowOuter}
      style={{
        width: arrowSize * factor,
        height: arrowSize * factor,
        transformOrigin: 'center center'
      }}
    >
      <LandingArrow innerRef={r_arrowInner}/>
    </Html>
  </group>
}

export default ScrollArrow