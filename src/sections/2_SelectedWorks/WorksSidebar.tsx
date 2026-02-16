import { useContext, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, useScroll } from "@react-three/drei"
import styled from "@emotion/styled"
import { Group } from "three"

import { ScreenContext } from "../../components/Providers"
import { colors } from "../../utils/constants"
import { useMedia } from "../../utils/hooks"

const WorksSidebar: React.FC<{}> = () => {

  const r_side = useRef<Group>(null!)
  const r_sidebar = useRef<Group>(null!)
  const r_sidebarText = useRef<HTMLParagraphElement>(null!)
  const r_sidebarTextSpan = useRef<HTMLSpanElement>(null!)

  const screen = useContext(ScreenContext)
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  const scrollData = useScroll()

  const sidebarPosition = width * 0.13

  const fontSize = useMedia(
    { initial: '30.5vh', end: '9.5vh' },
    { initial: '19.75rem', end: '5.25rem' },
    { initial: '0px', end : '0px' }
  )

  const fontSize2 = useMedia(
    { initial: '28vh', end: '9vh' },
    { initial: '18.5rem', end: '5rem' },
    { initial: '0px', end : '0px'}
  )

  useFrame(() => {
    const sidebarRange = scrollData.range(0.244, .025)
  
    if (!screen.mobile && r_sidebar.current && r_sidebarText.current) {
      r_sidebar.current.position.x = (-width / 2 + sidebarPosition) * sidebarRange
      r_sidebarText.current.style.width = `${(1 - sidebarRange) * (width * 0.74 * factor) + (width * 0.18 * factor)}px`
      r_sidebarText.current.style.fontSize = `calc(${(1 - sidebarRange)} * ${fontSize.initial} + ${fontSize.end})`
    }

    if (r_sidebarTextSpan.current) r_sidebarTextSpan.current.style.fontSize = `calc(${(1 - sidebarRange)} * ${fontSize2.initial} + ${fontSize2.end})`
  })

  return <group ref={r_side} visible={!screen.mobile}>
    <group ref={r_sidebar} position={[0, -width * 0.023, 0]}>
      <Html
        center
        // transform
        // distanceFactor={3.4}
        portal={{ current: scrollData.fixed }}
        ref={r_sidebarText}
        zIndexRange={[40, 41]}
        style={{
          color: colors.dirtyWhite,
          padding: '2rem',
          borderRight: `1px solid ${colors.dirtyWhite}`,
          font: "400 25rem/100% 'Neue Montreal'",
          letterSpacing: '-0.03em',
          width: width * 0.92 * factor,
          height: useMedia(height * .92, height - width * .046, 0) * factor,
        }}
      >
        <SidebarText>
          Selected
          <br/>
          <SidebarSpan ref={r_sidebarTextSpan}><em>W</em>ORKS &copy;</SidebarSpan>
        </SidebarText>
      </Html>
    </group>
  </group>
}

const SidebarText = styled.p``

const SidebarSpan = styled.span`
  font: 800 23.5rem/100% 'Formula Condensed';
  letter-spacing: 0.01em;
`

export default WorksSidebar