// libraries
import { Suspense, lazy, useCallback, useContext, useEffect, useRef } from 'react'
import { ScrollControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// modules
import { colors } from './utils/constants'
import { ScreenContext } from './components/Providers'
import './components/Materials'
import Menu  from './components/Menu'
import Landing from './sections/00_Landing'
// lazy loaded modules
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
  const screen = useContext(ScreenContext)

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
        <ScrollControls pages={screen.mobile ? 15 : 10} damping={screen.mobile ? 0.1 : 0.2}>
          <Suspense fallback={null}>
            <Menu />
            <Landing />
            <Welcome />
            <SelectedWorks />
            <Experiments />
            <CallToAction />
            <Credits />
          </Suspense>
        </ScrollControls>
      </Canvas>
    </Suspense>
    <div className='resize_cover' ref={r_cover} style={{ visibility: 'hidden' }}>
      <img src={cover} alt="resizing cover" width="1000px" height="1000px"/>
    </div>
  </main>
}

export default App
