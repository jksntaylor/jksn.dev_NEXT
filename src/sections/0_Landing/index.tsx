import { useRef } from "react"
import { useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { Group } from "three"
import LiquidText from "./LiquidText"
import ScrollArrow from "./ScrollArrow"
import SidewaysSlices from "./SidewaysSlices"
import { useMedia } from "../../utils/hooks"

const Landing = () => {
  const r_wrapper = useRef<Group>(null!)
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height } = viewport.getCurrentViewport()

  const menuWidth = useMedia(height * 0.1, width * 0.08, width)
  const sectionDistance = useMedia(width, width - menuWidth, width)

  useFrame(() => {
    const sectionOffset = scrollData.range(0.05, 0.05)
    r_wrapper.current.position.x = -sectionDistance * sectionOffset
  })

  return <group ref={r_wrapper}>
    <SidewaysSlices />
    <LiquidText />
    <ScrollArrow />
  </group>
}

export default Landing