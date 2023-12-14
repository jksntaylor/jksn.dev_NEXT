import { useThree } from "@react-three/fiber"
import BorderedPlane from "./BorderedPlane"
import { Vector3 } from "three"
import { Html, useScroll } from "@react-three/drei"

const Menu = () => {
  const scrollData = useScroll()
  const { camera, viewport } = useThree()
  const { height, width, factor } = viewport.getCurrentViewport(camera, [0, 0, 0])

  return <BorderedPlane
    width={width - 2/factor}
    height={height}
    factor={factor}
    position={new Vector3(-width + width * 0.085 + 2/factor, 0, 0.003)}
  >
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="menu"
      zIndexRange={[6, 7]}
      portal={{ current: scrollData.fixed }}
      style={{
        width: width * factor,
        height: height * factor
      }}
    >
      <h4>
        <span>Available for Freelance</span>
        <span>JACKSON TAYLOR</span>
        <span>January 2024</span>
      </h4>
    </Html>
  </BorderedPlane>
}

export default Menu
