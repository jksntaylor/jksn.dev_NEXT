import { useSinglePrismicDocument } from "@prismicio/react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, useScroll, useTexture } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"
// modules
import { colors } from "../utils/constants"
import { t_experiment } from "../utils/types"
import BorderedPlane from "../components/BorderedPlane"
import { t_experimentsMaterial } from "../components/Materials"


const Experiments = () => {
  const scrollData = useScroll()
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const r_wrapper = useRef<THREE.Group>(null!)
  const r_sidebar = useRef<THREE.Group>(null!)
  const r_sidebarInner = useRef<HTMLDivElement & { children: HTMLElement[] }>(null!)
  const r_experiments = useRef<THREE.Group>(null!)

  const [experiments] = useSinglePrismicDocument('experiments')

  // useEffect(() => {
  //   console.log(experiments)
  // }, [experiments])

  useFrame(() => {
    const sectionOffset = scrollData.range(.56, .05)
    const sidebarOffset = scrollData.range(.61, .04)
    const contentOffset = scrollData.range(.61, .19)
    const sectionOffset2 = scrollData.range(.8, .05)

    if (sectionOffset === 0 && r_wrapper.current.position.x !== width * .9575) {
      r_wrapper.current.position.x = width * .9575
    } else if (sectionOffset > 0 && sectionOffset2 < 1) {
      r_wrapper.current.position.x = -width * 0.915 * sectionOffset + width * 0.9575 - width * 0.915 * sectionOffset2
      if (r_sidebar.current) {
        r_sidebarInner.current.style.width = `${(width * .06 + (1 - sidebarOffset) * width * .24) * factor}px`
        r_sidebarInner.current.children[0].style.transform = `scaleX(${3.25 - sidebarOffset * 2.85})`
        r_sidebarInner.current.children[0].style.fontWeight = `${800 - sidebarOffset * 200}`

        r_sidebar.current.scale.x = (1 - sidebarOffset) * .8 + .2
        r_sidebar.current.children[2].scale.x = 1 / r_sidebar.current.scale.x
        r_sidebar.current.children[0].scale.x = .02 * sidebarOffset + 1
        r_sidebar.current.position.x = -width/2 + width * 0.0425 + width * (0.15 - sidebarOffset * 0.119)
      }
      r_experiments.current.position.x = contentOffset * -height * 0.45 * 4

    }
  })

  const Image: React.FC<{ url: string, index: number }> = ({ url, index }) => {
    const r_mat = useRef<t_experimentsMaterial>(null!)
    const texture = useTexture(url)

    useEffect(() => {
      if (r_mat.current.u_texture !== texture) r_mat.current.u_texture = texture
    }, [texture])

    return <mesh position={[index * height * 0.45, 0, 0]}>
      <planeGeometry args={[height * 0.4, height * 0.85]} />
      <experimentsMaterial ref={r_mat} />
    </mesh>
  }

  const renderExperiments = () => {
    return <group ref={r_experiments} position={[0, -width * 0.023, 0]}>
      {experiments && experiments.data.experiments.map((exp: t_experiment, i: number) => {
        return <Image url={exp.cover_image.url} key={i} index={i} />
      })}
    </group>
  }

  return <group ref={r_wrapper} position={[width * .915, 0, 0]}>
    <BorderedPlane // Top Section
      width={width * .915}
      height={width * .046}
      factor={factor}
      position={new Vector3(-1/factor, height / 2 - width * .023 + 1/factor, 0)}
    >
      <Html
        // center
        transform
        distanceFactor={3.4}
        className="experiments_top"
        portal={{ current: scrollData.fixed }}
        style={{
          width: width * .915 * factor,
          height: width * .046 * factor,
          borderBottom: `1px solid ${colors.dirtyWhite}`
        }}
        zIndexRange={[5, 6]}
      >
        <div className='section_number' style={{ width: width * 0.06 * factor }}>02</div>
        <div className="section_title">Experiments</div>
      </Html>
    </BorderedPlane>
    <BorderedPlane // Sidebar
      width={width * 0.3}
      height={height - width * 0.046 + 2/factor}
      factor={factor}
      position={new Vector3(-width/2 + width * 0.1925, -width * 0.023 + 1/factor, 0)}
      groupRef={r_sidebar}
    >
      <Html
        // center
        transform
        distanceFactor={3.4}
        className="experiments_side"
        portal={{ current: scrollData.fixed }}
        ref={r_sidebarInner}
        style={{
          width: width * 0.3 * factor + 2,
          height: (height - width * 0.046) * factor + 4,
        }}
        zIndexRange={[5, 6]}
      >
        <p className="experiments_side_text">E<em>X</em>PERIME<em>N</em>TS</p>
      </Html>
    </BorderedPlane>
    {renderExperiments()}
  </group>
}

export default Experiments
