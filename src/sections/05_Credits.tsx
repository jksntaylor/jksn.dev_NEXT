// libraries
import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
// modules
import { useMedia } from "../utils/hooks"
// assets
import '../styles/Credits.scss'
import Github from '../assets/svg/github'
import Insta from '../assets/svg/insta'
import Linkedin from "../assets/svg/linkedin"
import Dribbble from "../assets/svg/dribbble"

const Credits = () => {
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const scrollData = useScroll()

  const r_wrapper = useRef<THREE.Group>(null!)

  const wrapperOffset = useMedia(
    { start: width/2 + height * .4, move: height * .8 },
    { start: width/2 + width * .4575/2, move: width * 0.4575 },
    { start: 0, move: 0 },
  )

  useFrame(() => {
    const sectionOffset = scrollData.range(0.975, 0.025)
    if (sectionOffset === 0 && r_wrapper.current.position.x !== wrapperOffset.start) {
      r_wrapper.current.position.x = wrapperOffset.start
    } else if (sectionOffset > 0 && sectionOffset < 1) {
      r_wrapper.current.position.x = wrapperOffset.start - wrapperOffset.move * sectionOffset
    }
    else if (sectionOffset === 1 && r_wrapper.current.position.x !== wrapperOffset.start - wrapperOffset.move) {
      r_wrapper.current.position.x = wrapperOffset.start - wrapperOffset.move
    }
  })

  const handleClick = (i: number) => {
    window.dispatchEvent(new CustomEvent('toggleProject', { detail: i }))
  }

  return <group ref={r_wrapper} position={[width/2 + useMedia(height * .4, width * .4575/2, 0), 0, 0]}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="credits"
      zIndexRange={[3, 4]}
      portal={{ current: scrollData.fixed }}
      style={{
        width: useMedia(height * .8, width * 0.4575, 0) * factor,
        height: height * factor
      }}
    >
      <div className="credits_top" style={{ height: useMedia(height * .08, width * 0.046, 0) * factor }}>
        <div className="section_number" style={{ width: useMedia(height * .08, width * 0.046, 0) * factor }}>05</div>
        <p>Credits</p>
      </div>
      <div className="credits_bottom">
        <div className="credits_project_links">
          <div className="credits_project_link" onClick={() => handleClick(0)}>Tiktok Top Moments</div>
          <div className="credits_project_link" onClick={() => handleClick(1)}>RRE Ventures</div>
          <div className="credits_project_link" onClick={() => handleClick(2)}>Genies</div>
          <div className="credits_project_link" onClick={() => handleClick(3)}>Source 7</div>
          <div className="credits_project_link" onClick={() => handleClick(4)}>Realtime Robotics</div>
          <div className="credits_project_link" onClick={() => handleClick(5)}>Levi's 501 Day</div>
          <div className="credits_project_link" onClick={() => handleClick(6)}>Source 7</div>
          <div className="credits_project_link" onClick={() => handleClick(7)}>Huge Inc</div>
          <div className="credits_project_link" onClick={() => handleClick(8)}>Bitski</div>
          <div className="credits_project_link" onClick={() => handleClick(9)}>Introvoke</div>
        </div>
        <div className="credits_contributors">
          <div className="credits_contributor">
            <span className="credits_role">Development</span>
            <span className="credits_name">J<em>ack</em>so<em>n</em> <em>T</em>ay<em>lor</em></span>
            <div className="credits_social_links">
              <a href="https://github.com/jksntaylor" target="_blank" rel="noopener noreferrer" aria-label="github">
                <Github />
              </a>
              <a href="https://linkedin.com/in/jksntaylor" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                <Linkedin />
              </a>
              <a href="https://dribbble.com/jksntaylor" target="_blank" rel="noopener noreferrer" aria-label="dribbble">
                <Dribbble />
              </a>
            </div>
          </div>
          <div className="credits_contributor">
            <span className="credits_role">Creative Direction / Design</span>
            <span className="credits_name"><em>B</em>ra<em>ndo</em>n <em>Z</em>a<em>ch</em>ari<em>as</em></span>
            <div className="credits_social_links">
              <a href="https://dribbble.com/brandonzacharias" target="_blank" rel="noopener noreferrer" aria-label="dribbble">
                <Dribbble />
              </a>
              <a href="https://linkedin.com/in/brandon-zacharias" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                <Linkedin />
              </a>
              <a href="https://instagram.com/bzachariasdesign" target="_blank" rel="noopener noreferrer" aria-label="instagram">
                <Insta />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Html>
  </group>
}

export default Credits
