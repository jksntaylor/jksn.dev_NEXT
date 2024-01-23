import { useSinglePrismicDocument } from "@prismicio/react"
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { Html, useScroll, useTexture } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Vector2 } from "three"
import gsap from "gsap"
// modules
import { t_experimentsMaterial } from "../components/Materials"
import { t_experiment } from "../utils/types"
import { useMedia } from "../utils/hooks"
import { colors } from "../utils/constants"
import { lerp } from "../utils/functions"

const Experiments = () => {
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const scrollData = useScroll()

  const r_wrapper = useRef<THREE.Group>(null!)
  const r_sidebar = useRef<THREE.Group>(null!)
  const r_sidebarInner = useRef<HTMLDivElement & { children: HTMLElement[] }>(null!)
  const r_experiments = useRef<THREE.Group>(null!)
  const r_shift = useRef(0)

  const [experiments] = useSinglePrismicDocument('experiments')

  const innerHeight = useMedia(height * .92, height - width * .046, 0)
  const wrapperOffsets = useMedia(
    { start: width - height * .16, move: width - height * .08 },
    { start: width * .915, move: width * .9575 },
    { start: 0, move: 0 }
  )

  const sidebarOpts = useMedia(
    { start: height * .48, end: height * .15 + 1/factor, posX: height * .319 },
    { start: width * .3, end: width * .06 + 1/factor, posX: width * 0.1925 },
    { start: 0, end: 0, posX: 0 }
  )

  const fontScale = useMedia(
    { start: 3.25, end: 0.7 },
    { start: 3.25, end: 0.4 },
    { start: 0, end: 0 }
  )

  const experimentsPosition = useMedia(
    { start: -width/2 + height * .84, offset: height * .67 + (innerHeight * .6 * 5 - width)},
    { start: -width/2 + width * .331 + height * .3, offset: (height - width * .046) * 2 },
    { start: 0, offset: 0 },
  )

  useFrame(() => {
    const sectionRange = scrollData.range(.56, .05)
    const sidebarRange = scrollData.range(.61, .04)
    const contentRange = scrollData.range(.61, .19)
    const sectionRange2 = scrollData.range(.8, .05)

    if (sectionRange === 0 && r_wrapper.current.position.x !== wrapperOffsets.move) {
      r_wrapper.current.position.x = wrapperOffsets.move
    } else if (sectionRange > 0 && sectionRange2 < 1) {
      r_wrapper.current.position.x = -wrapperOffsets.start * sectionRange + wrapperOffsets.move - wrapperOffsets.start * sectionRange2
      if (r_sidebar.current) {
        r_sidebarInner.current.style.width = `${(sidebarOpts.end + (1 - sidebarRange) * (sidebarOpts.start - sidebarOpts.end)) * factor}px`
        r_sidebarInner.current.children[0].style.transform = `scaleX(${fontScale.start - sidebarRange * (fontScale.start - fontScale.end)})`
        r_sidebarInner.current.children[0].style.fontWeight = `${700 - sidebarRange * 200}`

        r_sidebar.current.position.x = -width/2 + sidebarOpts.posX - (sidebarOpts.start - sidebarOpts.end) / 2 * sidebarRange
      }

      r_experiments.current.position.x = experimentsPosition.start - experimentsPosition.offset * contentRange
0      // r_experiments.current.position.x = -contentRange * (innerHeight * .6 * 4)
      r_shift.current = .45 - (contentRange * .45)
    } else if (sectionRange2 === 1 && r_wrapper.current.position.x !== -wrapperOffsets.start) {
      r_wrapper.current.position.x = -wrapperOffsets.start
    }
  })

  const Image: React.FC<{ url: string, index: number, link: string, text: string }> = ({ url, index, link, text }) => {
    const r_mat = useRef<t_experimentsMaterial>(null!)
    const r_mouse = useRef(new Vector2(0, 0))
    const r_link = useRef<HTMLAnchorElement>(null!)
    const texture = useTexture(url)

    const handlePointerEnter = () => {
      gsap.to(r_mat.current, { u_mouse_rad: 0.3, duration: 0.85 })
      gsap.to(r_link.current.children[0], { y: 0, ease: 'expo.out' })
    }

    const handlePointerLeave = () => {
      gsap.to(r_mat.current, { u_mouse_rad: 0.0, duration: 0.85 })
      gsap.to(r_link.current.children[0], { y: '110%', ease: 'expo.out' })
    }

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => { if (e.uv) r_mouse.current.set(e.uv.x, e.uv.y) }

    useEffect(() => { if (r_mat.current.u_texture !== texture) r_mat.current.u_texture = texture }, [texture])

    useFrame((_s, delta) => {
      if (r_mat.current.u_mouse !== r_mouse.current) {
        r_mat.current.u_mouse.x = lerp(r_mat.current.u_mouse.x, r_mouse.current.x, 0.15)
        r_mat.current.u_mouse.y = lerp(r_mat.current.u_mouse.y, r_mouse.current.y, 0.15)
      }
      if (r_mat.current.u_shift !== r_shift.current) r_mat.current.u_shift = r_shift.current
      if (r_mat.current.u_mouse_rad > 0) r_mat.current.u_time += delta
    })

    return <group
      position={[index * innerHeight * 0.6, 0, 0]}
    >
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={e => handlePointerMove(e)}
        >
        <planeGeometry args={[innerHeight * 0.5, innerHeight * 0.9]} />
        <experimentsMaterial ref={r_mat} />
      </mesh>
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="experiment_image"
        portal={{ current: scrollData.fixed }}
        style={{
          width: innerHeight * 0.5 * factor,
          height: innerHeight * 0.9 * factor
        }}
        zIndexRange={[3, 4]}
      >
        <a
          href={link}
          ref={r_link}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Html>
    </group>
  }

  return <group ref={r_wrapper} position={[useMedia(width - height * .16, width * .915, 0), 0, 0]}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="experiments_top"
      portal={{ current: scrollData.fixed }}
      position={[useMedia(-1/factor, 0, 0), height / 2 - useMedia(height * .04, width * .023, 0) + 1/factor, 0]}
      style={{
        width: useMedia(width - height * .16, width * .915, 0) * factor,
        height: useMedia(height * .08, width * .046, 0) * factor,
        borderBottom: `1px solid ${colors.dirtyWhite}`
      }}
      zIndexRange={[5, 6]}
    >
      <div className='section_number' style={{ width: useMedia(height * .15, width * 0.06, 0) * factor }}>03</div>
      <div className="section_title">Experiments</div>
    </Html>
    <group
      position={[-width/2 + useMedia(height * .319, width * 0.1925, 0), useMedia(-height * .04, -width * .023, 0), 0.001]}
      ref={r_sidebar}
    >
      <Html
        center
        // transform
        // distanceFactor={3.4}
        className="experiments_side"
        portal={{ current: scrollData.fixed }}
        ref={r_sidebarInner}
        style={{
          width: sidebarOpts.start * factor + 2,
          height: (height - useMedia(height * .08, width * 0.046, 0)) * factor + 4,
        }}
        zIndexRange={[5, 6]}
      >
        <p className="experiments_side_text">E<em>X</em>PERIME<em>N</em>TS</p>
      </Html>
    </group>
    <group ref={r_experiments} position={[
      experimentsPosition.start,
      useMedia(-height * .04, -width * .023, 0),
      0
      ]}>
      {experiments && experiments.data.experiments.map((exp: t_experiment, i: number) => {
        return <Image
          key={i}
          index={i}
          text={exp.title}
          link={exp.live_link}
          url={exp.cover_image.url}
        />
      })}
    </group>
  </group>
}

export default Experiments
