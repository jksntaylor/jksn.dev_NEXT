import styled from "@emotion/styled"
import { Html, useScroll } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useRef } from "react"
import { Group } from "three"

import { useMedia } from "../../utils/hooks"
import { colors } from "../../utils/constants"
import StarSVG from "../../assets/svg/star"
import { keyframes } from "@emotion/css"

const MenuDrawer = () => {

  const r_drawerWrapper = useRef<Group>(null!)
  const r_drawer = useRef<HTMLDivElement>(null!)

  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()

  const drawerHeight = useMedia(0, 0, height - width * .15)
  
  return <group
    ref={r_drawerWrapper}
  >
    <Html
      center
      // transform
      // distanceFactor={3.4}
      ref={r_drawer}
      zIndexRange={[30, 31]}
      portal={{ current: scrollData.fixed }}
      position={[
        useMedia(0, -width * 0.895, 0),
        useMedia(0, 0, width * .15 - drawerHeight - 1/factor),
        0
      ]}
      style={{
        width: useMedia(width - height * 0.1, width * 0.95, width) * factor,
        height: useMedia(height, height, drawerHeight) * factor,
        display: 'flex',
        background: colors.fadedBlack
      }}
    >
      <MenuLinks>
          {/* to-do: build infinite scroll */}
      </MenuLinks>
      <MenuInfo>
        
        <InfoText><Star />Available for Freelance</InfoText>
        <InfoText>JACKSON TAYLOR</InfoText>
        <InfoText>March 2026+<Star /></InfoText>
        
      </MenuInfo>
    </Html>
  </group>
}

const MenuLinks = styled.nav`
  width: 92vw;
  color: ${colors.dirtyWhite};
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const MenuInfo = styled.div`
  color: ${colors.dirtyWhite};
  font: 400 1vw 'Neue Montreal';
  writing-mode: vertical-lr;
  width: 3vw;
  border-right: 1px solid ${colors.dirtyWhite};
  display: flex;
  justify-content: space-between;
  align-items: center;
  `

const InfoText = styled.span`
  display: flex;
  align-items: center;
  column-gap: 1vw;
  padding: 1vw 0;
  svg {
    width: 1.5vw;
    height: 1.5vw;
    animation: ${spin} 10s linear infinite;
  }
`



const Star = styled(StarSVG)`
  animation: ${spin} 2s linear infinite;
`
export default MenuDrawer