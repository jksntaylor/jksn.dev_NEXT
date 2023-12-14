// libraries
import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
// modules
import './components/Materials'
import Menu from './components/Menu'
import Landing from './sections/Landing'
import Welcome from './sections/Welcome'
import SelectedWorks from './sections/SelectedWorks'
import { colors } from './utils/constants'
// styles
import './App.scss'

function App() {

  const [scrollEnabled, setScrollEnabled] = useState(true)

  const toggleScroll = () => setScrollEnabled(!scrollEnabled)

  return <main>
    <Suspense fallback={null}>
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={[colors.fadedBlack]} />
        <OrbitControls enableZoom={false}/>
        <ScrollControls pages={10} damping={0.2} enabled={scrollEnabled}>
          <Menu />
          <Landing />
          <Welcome />
          <SelectedWorks toggleScroll={toggleScroll}/>
          {/* <Experiments /> */}
          {/* <CallToAction /> */}
          {/* <Credits /> */}
        </ScrollControls>
      </Canvas>
    </Suspense>
  </main>
}

export default App
