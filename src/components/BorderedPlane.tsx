import { Html, useScroll } from "@react-three/drei"

type Props = {
  width: number
  height: number
  factor: number
  background: string
  border: string
}

const BorderedPlane: React.FC<Props> = ({width, height, factor, background, border}) => {
  // const r_text = useRef()
  const scrollData = useScroll()
  return <group>
    <mesh position={[0, 0, -0.001]}>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshBasicMaterial color={border} />
    </mesh>
    <mesh>
      <planeGeometry args={[width - 2/factor, height - 2/factor, 1, 1]} />
      <meshBasicMaterial color={background} />
    </mesh>
    <Html transform portal={{ current: scrollData.fixed }}><div>VARIABLE TEST</div></Html>
  </group>
}

export default BorderedPlane
