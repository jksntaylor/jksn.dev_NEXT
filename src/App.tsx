// libraries
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
import './styles/App.scss'
import cover from './assets/images/resize_cover.png'

function App() {

  const [showResizeCover, setShowResizeCover] = useState(false)

  const resetTimer = useRef(setTimeout(() => {}))

  const handleResize = useCallback(() => {
    setShowResizeCover(true)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      setShowResizeCover(false)
    }, 2000);
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  const DisableRender = () => useFrame(() => null, 1000)


  return <main>
    <Suspense fallback={null}>
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={[colors.fadedBlack]} />
        {/* <OrbitControls enableZoom={false}/> */}
        <ScrollControls pages={10} damping={0.2}>
          {showResizeCover && <DisableRender />}
          <Menu />
          <Landing />
          <Welcome />
          <SelectedWorks />
          {/* <Experiments /> */}
          {/* <CallToAction /> */}
          {/* <Credits /> */}
        </ScrollControls>
      </Canvas>
    </Suspense>
    {showResizeCover && <div className='resize_cover'>
      <img src={cover} alt="resizing cover" />
    </div>}
  </main>
}

export default App
