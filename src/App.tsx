// libraries
import { Suspense, lazy, useCallback, useContext, useEffect, useRef } from 'react'
import { PerspectiveCamera, ScrollControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
// modules
import { colors } from './utils/constants'
import { DebugContext, ScreenContext } from './components/Providers'
import './components/Materials'
// import Menu  from './components/Menu'
import Menu from './components/Menu/index'
import Landing from './sections/0_Landing'
// lazy loaded modules
const Welcome = lazy(() => import('./sections/1_Welcome'))
const SelectedWorks = lazy(() => import('./sections/2_SelectedWorks'))
const Experiments = lazy(() => import('./sections/3_Experiments'))
const CallToAction = lazy(() => import('./sections/4_CallToAction'))
const Credits = lazy(() => import('./sections/5_Credits'))
// styles
import cover from './assets/images/resize_cover.webp'
// import Preloader from './components/Preloader'
import './styles/App.scss'

function App() {

  const resetTimer = useRef(setTimeout(() => {}))
  const r_cover = useRef<HTMLDivElement>(null!)
  const screen = useContext(ScreenContext)
  const debug = useContext(DebugContext)

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
      <Canvas gl={{ antialias: true }} dpr={Math.min(window.devicePixelRatio, 2)}>
        <color attach="background" args={[colors.fadedBlack]} />
        <ScrollControls pages={screen.mobile ? 15 : 10} damping={screen.mobile ? 0.1 : 0.2}>
          <Menu />
          <Landing />
          <Welcome />
          <SelectedWorks />
          <Experiments />
          <CallToAction />
          <Credits />
        </ScrollControls>
        {debug.debug && <>
          {/* to do: reset camera settings on undo */}
          <OrbitControls enableZoom={false}/>
          <Stats />
        </>}
      </Canvas>
    </Suspense>
    <div className='resize_cover' ref={r_cover} style={{ visibility: 'hidden' }}>
      <img src={cover} alt="resizing cover" width="1000px" height="1000px"/>
    </div>
    {/* <Preloader /> */}
  </main>
}

export default App
