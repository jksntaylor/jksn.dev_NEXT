// libraries
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
// import { OrbitControls } from '@react-three/drei'
// modules
import './components/Materials'
import Menu from './components/Menu'
import Landing from './sections/Landing'
import Welcome from './sections/Welcome'
import SelectedWorks from './sections/SelectedWorks'
import { colors } from './utils/constants'
// styles
import cover from './assets/images/resize_cover.webp'
import './styles/App.scss'
import Experiments from './sections/Experiments'

function App() {

  const resetTimer = useRef(setTimeout(() => {}))
  const r_cover = useRef<HTMLDivElement>(null!)

  const handleResize = useCallback(() => {
    r_cover.current.style.visibility = 'visible'
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      r_cover.current.style.visibility = 'hidden'
    }, 500);
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return <main>
    <Suspense fallback={null}>
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={[colors.fadedBlack]} />
        {/* <OrbitControls enableZoom={false}/> */}
        <ScrollControls pages={10} damping={0.2}>
          <Menu />
          <Landing />
          <Welcome />
          <SelectedWorks />
          <Experiments />
          {/* <CallToAction /> */}
          {/* <Credits /> */}
        </ScrollControls>
      </Canvas>
    </Suspense>
    <div className='resize_cover' ref={r_cover} style={{ visibility: 'hidden' }}>
      <img src={cover} alt="resizing cover" />
    </div>
  </main>
}

export default App
