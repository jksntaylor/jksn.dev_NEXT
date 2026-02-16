import { useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Group } from "three"
import WorksList from "./WorksList"
import { useSinglePrismicDocument } from "@prismicio/react"
import WorksSidebar from "./WorksSidebar"
import WorksCounter from "./WorksCounter"

const SelectedWorks: React.FC<{}> = () => {

  const scrollData = useScroll()
  const { viewport } = useThree()
  const { height, width, factor } = viewport.getCurrentViewport()

  const r_wrapper = useRef<Group>(null!)

  const menuWidth = width * 0.08
  const r_lastInRange = useRef(0)
  const r_lastOutRange = useRef(0)

  const [home] = useSinglePrismicDocument('homepage', {
    fetchLinks: [
      'case_study.cover_image',
      'case_study.awards',
      'case_study.project_title',
      'case_study.project_link',
      'case_study.project_link_text',
      'case_study.year',
      'case_study.role',
      'case_study.client1',
      'case_study.client2',
      'case_study.images',
      'case_study.project_description'
    ]
  })

  // useEffect(() => {
  //   console.log('home', home)
  // }, [home])

  useFrame(() => {
    const offsetInRange = scrollData.range(.194, .05)
    const offsetOutRange = scrollData.range(0.56, 0.05)

    if (r_lastInRange.current === offsetInRange && r_lastOutRange.current === offsetOutRange) return;

    if (offsetInRange === 0 && r_wrapper.current.position.x !== width * 0.96) {
      r_wrapper.current.position.setX(width * 0.96)
    } else if (offsetInRange === 1 && offsetOutRange === 0 && r_wrapper.current.position.x !== width * 0.04) {
      r_wrapper.current.position.setX(width * 0.04)
    } else if (offsetOutRange === 1 && r_wrapper.current.position.x !== width * -0.88) {
      r_wrapper.current.position.setX(width * -0.88)
    } else if (offsetInRange > 0 && offsetOutRange < 1) {
      if (offsetInRange === 1 && offsetOutRange === 0) return
      console.log('animating sw edges')
      r_wrapper.current.position.setX(width * 0.96 - (width * 0.92 * offsetInRange) - (width * 0.92 * offsetOutRange))
    }

    r_lastInRange.current = offsetInRange
    r_lastOutRange.current = offsetOutRange
  })

  return <group ref={r_wrapper} position={[width * 0.96, 0, 0]}>
    <mesh>
      <planeGeometry args={[width - menuWidth, height]} />
      <meshBasicMaterial color={'red'} />
    </mesh>
    <WorksSidebar />
    <WorksCounter />
    {home && <WorksList data={home.data.case_studies}/>}
  </group>
}


export default SelectedWorks