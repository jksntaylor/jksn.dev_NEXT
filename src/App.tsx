// libraries
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
// import { OrbitControls } from '@react-three/drei'
// modules
import Menu from './components/Menu'
import Landing from './sections/Landing'
import Welcome from './sections/Welcome'
import SelectedWorks from './sections/SelectedWorks'
import { colors } from './utils/constants'
// styles
import './App.scss'

function App() {
  return <main>
    <Suspense fallback={null}>
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={[colors.darkModeAccent_2]} />
        {/* <OrbitControls enableZoom={false}/> */}
        <ScrollControls pages={10} damping={0.2}>
          <Menu />
          {/* <Scene /> */}
          <Landing />
          <Welcome />
          <SelectedWorks />
          {/* <Experiments /> */}
          {/* <CallToAction /> */}
          {/* <Credits /> */}
        </ScrollControls>
      </Canvas>
    </Suspense>
  </main>
}

export default App
