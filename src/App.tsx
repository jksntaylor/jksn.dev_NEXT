// libraries
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ScrollControls } from '@react-three/drei'
// modules
import Menu from './components/Menu'
import Landing from './sections/Landing'
import { colors } from './utils/constants'
// styles
import './App.scss'
import Welcome from './sections/Welcome'

function App() {
  return <main>
    <Suspense fallback={null}>
      <Canvas gl={{ antialias: true }} dpr={[1, 1.5]}>
        <color attach="background" args={[colors.darkModeAccent]} />
        <OrbitControls enableZoom={false}/>
        <ScrollControls pages={10} damping={0.3}>
          <Menu />
          {/* <Scene /> */}
          <Landing />
          <Welcome />
          {/* <SelectedWorks /> */}
          {/* <Experiments /> */}
          {/* <CallToAction /> */}
          {/* <Credits /> */}
        </ScrollControls>
      </Canvas>
    </Suspense>
  </main>
}

export default App
