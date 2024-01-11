import { Html, useScroll } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"

import dribbble from '../assets/images/dribbble.svg'
import linkedin from '../assets/images/linkedin.svg'
import github from '../assets/images/github.svg'
import insta from '../assets/images/insta.svg'

const Credits = () => {
  const { height, width, factor } = useThree().viewport.getCurrentViewport()
  const scrollData = useScroll()

  const r_wrapper = useRef<THREE.Group>(null!)

  useFrame(() => {
    const sectionOffset = scrollData.range(0.975, 0.025)
    if (sectionOffset === 0 && r_wrapper.current.position.x !== width * .915) {
      r_wrapper.current.position.x = width * .73
    } else if (sectionOffset > 0 && sectionOffset < 1) {
      r_wrapper.current.position.x = width * .73 - width * 0.4575 * sectionOffset
    }
  })

  return <group ref={r_wrapper} position={[width * 0.9575, 0, 0]}>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="credits"
      zIndexRange={[3, 4]}
      portal={{ current: scrollData.fixed }}
      style={{
        width: width * 0.4575 * factor,
        height: height * factor
      }}
    >
      <div className="credits_top" style={{ height: width * 0.046 * factor }}>
        <div className="section_number" style={{ width: width * 0.046 * factor }}>05</div>
        <p>Credits</p>
      </div>
      <div className="credits_bottom">
        <div className="credits_project_links">
          <div className="credits_project_link">Tiktok Top Moments</div>
          <div className="credits_project_link">RRE Ventures</div>
          <div className="credits_project_link">Genies</div>
          <div className="credits_project_link">Source 7</div>
          <div className="credits_project_link">Realtime Robotics</div>
          <div className="credits_project_link">Levi's 501 Day</div>
          <div className="credits_project_link">Source 7</div>
          <div className="credits_project_link">Huge Inc</div>
          <div className="credits_project_link">Bitski</div>
          <div className="credits_project_link">Introvoke</div>
        </div>
        <div className="credits_contributor">
          <span className="credits_role">Development</span>
          <span className="credits_name">J<em>ack</em>so<em>n</em> <em>T</em>ay<em>lor</em></span>
          <div className="credits_social_links">
            <a href="https://github.com/jksntaylor" target="_blank" rel="noopener noreferrer" aria-label="github">
              <img alt="github" src={github}/>
            </a>
            <a href="https://linkedin.com/in/jksntaylor" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
              <img alt="linkedin" src={linkedin} />
            </a>
            <a href="https://dribbble.com/jksntaylor" target="_blank" rel="noopener noreferrer" aria-label="dribbble">
              <img alt="dribbble" src={dribbble} />
            </a>
          </div>
        </div>
        <div className="credits_contributor">
          <span className="credits_role">Creative Direction &amp; Design</span>
          <span className="credits_name"><em>B</em>ra<em>ndo</em>n <em>Z</em>a<em>ch</em>ari<em>as</em></span>
          <div className="credits_social_links">
            <a href="https://dribbble.com/brandonzacharias" target="_blank" rel="noopener noreferrer" aria-label="dribbble">
              <img alt="dribbble" src={dribbble} />
            </a>
            <a href="https://linkedin.com/in/brandon-zacharias" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
              <img alt="linkedin" src={linkedin} />
            </a>
            <a href="https://instagram.com/bzachariasdesign" target="_blank" rel="noopener noreferrer" aria-label="instagram">
              <img alt="instagram" src={insta} />
            </a>
          </div>
        </div>
      </div>
    </Html>
  </group>
}

export default Credits
