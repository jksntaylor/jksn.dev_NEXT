import { Html, useScroll } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useContext, useRef } from "react"
import { Group } from "three"

import { ScreenContext } from "../../components/Providers"
import { colors } from "../../utils/constants"
import { useMedia } from "../../utils/hooks"
import styled from "@emotion/styled"

const WorksCounter = () => {

  const r_top = useRef<Group>(null!)
  const r_counter1 = useRef<HTMLDivElement>(null!)
  const r_counter2 = useRef<HTMLDivElement>(null!)

  const screen = useContext(ScreenContext)
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  const scrollData = useScroll()

  return <group ref={r_top} position={[0, width * 0.92, 0]}>
    <color args={['#00F']} attach="background" />
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="selectedworks_top"
      position={[0, height / 2 - useMedia(height * 0.04, width * .023, width * .06) + 1/factor, 0]}
      portal={{ current: scrollData.fixed }}
      zIndexRange={[2, 3]}
      style={{
        width: useMedia(width - height * 0.16, width * .92, width) * factor,
        height: useMedia(height * .08, width * .046, width * .12) * factor,
        display: 'flex',
        borderBottom: `1px solid ${colors.dirtyWhite}`
      }}
    >
      <SectionNumber
        style={{ width: useMedia(height * 0.08, width * .046, width * .12) * factor }}
      >
        02
      </SectionNumber>
      <Counter>
        {screen.mobile && <p>Selected Works</p>}
        <CounterMask>
          <CounterColumn ref={r_counter1}>01</CounterColumn>
          <CounterColumn ref={r_counter2}>1234567890</CounterColumn>
          <span>/10</span>
        </CounterMask>
      </Counter>
    </Html>
  </group>
}

const SectionNumber = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (aspect-ratio < 1) {
    background: ${colors.fadedBlack} 
  }
`

const Counter = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;
  margin-right: 2rem;
  background: ${colors.fadedBlack};
  border-left: 1px solid ${colors.dirtyWhite};
  @media screen and (aspect-ratio < 1) {
    margin-right: 2vw;
    p {
      color: ${colors.dirtyWhite};
      font: 400 5vw/100% 'Neue Montreal';
      margin-right: auto;
      margin-left: 2vw;
    }
  }
`

const CounterMask = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;
  margin-right: 2rem;
  background: ${colors.fadedBlack};
  border-left: 1px solid ${colors.dirtyWhite};
  @media screen and (aspect-ratio < 1) {
    margin-right: 2vw;
    p {
      color: ${colors.dirtyWhite};
      font: 400 5vw/100% 'Neue Montreal';
      margin-right: auto;
      margin-left: 2vw;
    }
  }
`

const CounterColumn = styled.div`
  width: 1.5rem;
  word-break: break-all;
  text-align: center;
  &:first-of-type {
    text-align: right;
  }
  @media screen and (aspect-ratio > 1.8) {
    width: 2vh;
  }
  @media screen and (aspect-ratio < 1) {
    width: 2.8vw;
  }
`

export default WorksCounter