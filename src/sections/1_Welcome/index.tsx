//libraries
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useRef } from 'react'
import { Group, Vector2, Vector3 } from "three"
import styled from "@emotion/styled"
// assets
import { ScreenContext } from "../../components/Providers"
import { colors } from "../../utils/constants"
import { useMedia } from "../../utils/hooks"

const Welcome = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const screen = useContext(ScreenContext)
  const { height, width, factor } = viewport.getCurrentViewport()
  const r_text = useRef<HTMLHeadingElement>(null!)
  const r_wrapper = useRef<Group>(null!)
  const r_content = useRef<HTMLDivElement>(null!)
  const r_definition = useRef<HTMLDivElement>(null!)

  const wrapperWidth = height * 3.63
  const menuWidth = useMedia(height * 0.1, width * 0.08, width)

  const wrapperInitialX = (wrapperWidth + width) * 0.5
  const wrapperOffset = wrapperWidth + (width - menuWidth)

  const r_lastRange = useRef(0)

  useFrame(() => {
    const wrapperRange = scrollData.range(0.05, 0.194)
    const fontWeightRange = scrollData.range(0.06, 0.15)

    if (r_lastRange.current === wrapperRange) return;

    if (wrapperRange === 0 || wrapperRange === 1) {
      if (r_lastRange.current > 0 && r_lastRange.current < 1) {
        r_wrapper.current.position.setX(wrapperInitialX - (wrapperOffset * wrapperRange))
      }
    } else {
      r_wrapper.current.position.setX(wrapperInitialX - (wrapperOffset * wrapperRange))
      if (r_text.current && r_content.current) {
        r_text.current.style.fontWeight = `${700 * fontWeightRange + 200}`
        r_content.current.style.left = `${60 * wrapperRange + 20}%`
      }
    }
    
    r_lastRange.current = wrapperRange
  })

  return <group position={[wrapperInitialX, 0, 0]} ref={r_wrapper}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      zIndexRange={[11, 12]}
      portal={{ current: scrollData.fixed }}
      style={{
        height: useMedia(height, height, height - width * .23) * factor,
        width: wrapperWidth * factor,
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${colors.dirtyWhite}`,
        borderTop: 'none',
        borderBottom: 'none',
      }}
    >
      <WelcomeText ref={r_text}>WELCOME</WelcomeText>
      <WelcomeContent ref={r_content}>
        <div className='section_number'>
          01
        </div>
        <WelcomeDefinition ref={r_definition}>
          <span>C<em>R</em>E•<em>A</em>•TI<em>V</em>E <em>D</em>E•V<em>EL</em>•O<em>P</em>•E<em>R</em></span>
          <span>(noun)</span>
          <p>A frontend dev{screen.mobile && 'eloper'} who specializes in interactive animation and 3D for the web</p>
          <p>See also: someone who has a knack<br/>for making laptops overheat</p>
        </WelcomeDefinition>
      </WelcomeContent>
    </Html>
  </group>
}

// Styled Components
const WelcomeContent = styled.div`
  position: absolute;
  top: -1px;
  left: 30%;
  height: 100vh;
  @media screen and (aspect-ratio < 1) {
    height: calc(100vh - 23vw);
    left: 5%;
  }
  .section_number {
    border: 1px solid ${colors.dirtyWhite};
    width: 4.6vw;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 60%;
    mix-blend-mode: exclusion;
    @media screen and (aspect-ratio > 1.8) {
      margin-bottom: 40vh;
    }
  }
`

const WelcomeText = styled.h1`
  color: ${colors.dirtyWhite};
  background: ${colors.fadedBlack};
  font: 100 125vh/100% 'Formula Condensed';
  letter-spacing: -2vh;
  padding: 0;
  width: 363vh;
`

const WelcomeDefinition = styled.div`
  width: 50rem;
  background: ${colors.darkModeAccent_2};
  border: 2px solid ${colors.fadedBlack};
  padding: 3rem;
  span {
    display: block;
    font: 400 4rem/100% 'Formula Condensed';
  }
  span:last-of-type {
    font: italic 700 1.8rem/120% 'Neue Montreal';
    margin-bottom: 2rem;
  }
  p:first-of-type {
    text-transform: uppercase;
    font: 400 2.5rem/120% 'Neue Montreal';
    margin-bottom: 2rem;
  }
  p:last-of-type {
    font: 100 1.6rem/120% 'Neue Montreal';
    text-transform: uppercase;
    text-align: right;
  }
  @media screen and (aspect-ratio > 1.8) {
    width: 62vh;
    padding: 4vh;
    span {
      font-size: 5vh;
      &:last-of-type {
        font-size: 2vh;
      }
    }
    p:first-of-type {
      font-size: 3vh;
    }
    p:last-of-type {
      font-size: 2.5vh;
    }
  }
  @media screen and (aspect-ratio < 1) {
    width: 90vw;
    padding: 5vw;
    span:first-of-type {
      font-size: 7.6vw;
    }
    span:last-of-type {
      font-size: 4vw;
      margin-bottom: 4vw;
    }
    p:first-of-type {
      font-size: 5vw;
      margin-bottom: 4vw;
    }
    p:last-of-type {
      font-size: 3.8vw;
    }
  }
`

export default Welcome
