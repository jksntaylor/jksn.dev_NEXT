import { Vector3 } from 'three'

type Props = {
  width: number
  height: number
  factor: number
  position?: Vector3
  background: string
  border: string
  children?: React.ReactNode
}

const BorderedPlane: React.FC<Props> = ({
  width,
  height,
  factor,
  position,
  background,
  border,
  children
}) => {
  return <group position={position}>
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
