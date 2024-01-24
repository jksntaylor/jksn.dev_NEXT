// libraries
import { Suspense, lazy, useCallback, useEffect, useRef } from 'react'
import { ScrollControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// modules
import './components/Materials'
import { colors } from './utils/constants'
// lazy loading modules
const Menu = lazy(() => import('./components/Menu'))
const Landing = lazy(() => import('./sections/00_Landing'))
const Welcome = lazy(() => import('./sections/01_Welcome'))
const SelectedWorks = lazy(() => import('./sections/02_SelectedWorks'))
const Experiments = lazy(() => import('./sections/03_Experiments'))
const CallToAction = lazy(() => import('./sections/04_CallToAction'))
const Credits = lazy(() => import('./sections/05_Credits'))
// styles
import cover from './assets/images/resize_cover.webp'
import './styles/App.scss'

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
          <Suspense fallback={null}>
            <Menu />
            <Landing />
            {/* <Welcome /> */}
            {/* <SelectedWorks /> */}
            {/* <Experiments /> */}
            {/* <CallToAction /> */}
            {/* <Credits /> */}
          </Suspense>
        </ScrollControls>
      </Canvas>
    </Suspense>
    <div className='resize_cover' ref={r_cover} style={{ visibility: 'hidden' }}>
      <img src={cover} alt="resizing cover" />
    </div>
  </main>
}

export default App
