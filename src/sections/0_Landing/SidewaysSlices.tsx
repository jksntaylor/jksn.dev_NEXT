import styled from "@emotion/styled"
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { colors } from "../../utils/constants"
import { useMedia } from "../../utils/hooks"

const SidewaysSlices = () => {
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()

  const r_slices = useRef<HTMLDivElement & { children: HTMLHeadingElement[]}>(null!)

  useFrame(() => {
    if (!r_slices.current) return
    const sliceOffset = scrollData.range(0, 0.05)

    for (let i = 0; i < r_slices.current.children.length; i++) {
      const newX = `translateX(${(1 - sliceOffset) * (120 + 60 * i)}%)`
      r_slices.current.children[i].style.transform = newX
    }
  })

  const emphasize = (text: string) => {
    return <>
      {text.split('').map((char, i) => {
        return char.match(/[A-Z]/) ? <em key={i}>{char}</em> : char
      })}
    </>
  }

  return <Html
    center
    // transform
    // distanceFactor={3.4}
    position={[useMedia(height * 0.08, width * 0.0425, -1/factor) + 1/factor, useMedia(0, 0, width * 0.115), 0.001]}
    portal={{ current: scrollData.fixed}}
    zIndexRange={[2, 3]}
    style={{
      width: useMedia(width - height * 0.16, width * 0.915, width + 2/factor) * factor - 2,
      height: useMedia(height, height, height - width * .23) * factor
    }}
    ref={r_slices}
  >
      <LandingSlice><SliceText>{emphasize("lEt's bUild")}</SliceText></LandingSlice>
      <LandingSlice><SliceText>{emphasize("SoMEthiNG")}</SliceText></LandingSlice>
      <LandingSlice><SliceText>{emphasize("neW")}</SliceText></LandingSlice>
  </Html>
}

const LandingSlice = styled.div`
  background: ${colors.fadedBlack};
  border-left: 1px solid ${colors.dirtyWhite};
  border-bottom: 1px solid ${colors.dirtyWhite};
  &:nth-of-type(1) {
    transform: translateX(120%);
  }
  &:nth-of-type(2) {
    transform: translateX(180%);
  }
  &:nth-of-type(3) {
    transform: translateX(240%);
  }
`

const SliceText = styled.h3`
  color: ${colors.dirtyWhite};
  width: 91.5vw;
  font: 400 clamp(100px, 21.5vh, 16vw)/85% 'Formula Condensed';
  padding: 3vw;
  text-shadow: 4px 4px ${colors.darkModeAccent}, 8px 8px ${colors.darkModeAccent_2};
  text-transform: uppercase;
  @media screen and (aspect-ratio > 1.8) {
    width: calc(100vw - 17vh);
    font-size: 25vh;
    padding: 8vh 0 0 4vh;
    text-shadow: 0.8vh 0 ${colors.darkModeAccent}, 1.6vh 0 ${colors.darkModeAccent_2};
  }
  @media screen and (aspect-ratio < 1) {
    width: 100vw;
    font-size: clamp(32px, 28vw, 10vh);
    line-height: 100%;
    padding: 8vw 4vw;
    text-shadow:0.5vw 0 ${colors.darkModeAccent}, 2vw 0 ${colors.darkModeAccent_2};
    letter-spacing: 1.5vw;
  }
`

export default SidewaysSlices