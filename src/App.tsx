// libraries
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ScrollControls } from '@react-three/drei'
// modules
import Menu from './components/Menu'
import Landing from './sections/Landing'
import { colors } from './utils/constants'
// styles
import './App.scss'

function App() {
  return <main>
    <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} camera={{ zoom: 0.9 }}>
      <color attach="background" args={[colors.darkModeAccent]} />
      <OrbitControls enableZoom={false}/>
      <ScrollControls pages={6} damping={0.25} style={{ left: '5px' }}>
        <Menu />
        {/* <Scene /> */}
        <Landing />
        {/* <Welcome /> */}
        {/* <SelectedWorks /> */}
        {/* <Experiments /> */}
        {/* <CallToAction /> */}
        {/* <Credits /> */}
      </ScrollControls>
    </Canvas>
  </main>
}

export default App
