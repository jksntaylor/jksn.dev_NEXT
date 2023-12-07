import { Vector3 } from 'three'
import { colors } from '../utils/constants'

export type BorderedPlaneProps = {
  width: number
  height: number
  factor: number
  position?: Vector3
  background?: string
  border?: string
  children?: React.ReactNode
  groupRef?: React.MutableRefObject<THREE.Group>
}

const BorderedPlane: React.FC<BorderedPlaneProps> = ({
  width,
  height,
  factor,
  position,
  background = colors.fadedBlack,
  border = colors.dirtyWhite,
  children,
  groupRef
}) => {
  return <group position={position} ref={groupRef}>
    <mesh>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshBasicMaterial color={border} />
    </mesh>
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[width - 2/factor, height - 2/factor, 1, 1]} />
      <meshBasicMaterial color={background} />
    </mesh>
    {children && <group position={[0, 0, 0.002]}>
      {children}
    </group>}
  </group>
}

export default BorderedPlane
