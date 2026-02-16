import { useFrame, useThree } from "@react-three/fiber"
import { useMedia } from "../../utils/hooks"
import { useEffect, useRef } from "react"
import { t_selectedWorksMaterial } from "./shader"
import { Mesh } from "three"
import { useTexture } from "@react-three/drei"

const WorksImage: React.FC<{url: string, index: number, delta: number }> = ({ url, index, delta }) => {
  const { viewport } = useThree()
  const { width, height } = viewport.getCurrentViewport()
  
  const r_mat = useRef<t_selectedWorksMaterial>(null!)
  const r_mesh = useRef<Mesh>(null!)
  const texture = useTexture(url)

  const imageSizes = useMedia({ w: height * .632, h: height * .75 }, { w: width * 0.374, h: width * .444 }, { w: width * .85, h: width * 1.009 })
  const imageOffset = useMedia(height * .92, height - width * .046, height - width * .35)
  const posX = useMedia((width - height * .96)/2 - height * 0.316, width * .1255, 0)

  useEffect(() => {
    if (r_mat.current.u_texture !== texture) r_mat.current.u_texture = texture
    r_mesh.current.position.set(index % 2 ? -posX : posX, -imageOffset * index, 0)
  }, [posX, index, texture])

  useFrame(() => {
    if (r_mat.current.u_delta !== delta) r_mat.current.u_delta = delta
  })

  return <mesh ref={r_mesh}>
    <planeGeometry args={[imageSizes.w , imageSizes.h, 48, 1]} />
    <selectedWorksMaterial ref={r_mat} u_zoom={(height / imageSizes.h) + .1}/>
  </mesh>
}

export default WorksImage