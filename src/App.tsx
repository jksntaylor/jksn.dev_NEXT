import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, ScrollControls } from '@react-three/drei'
import './App.scss'
import BorderedPlane from './components/BorderedPlane'
import { colors } from './utils/constants'
import Menu from './components/Menu'
import Landing from './sections/Landing'

// const Scene = () => {
//   const { viewport } = useThree()
//   const { width, height } = viewport.getCurrentViewport()

//   return <BorderedPlane
//     width={width}
//     height={height}
//     factor={viewport.factor}
//     background={colors.fadedBlack}
//     border={colors.dirtyWhite}
//   />
// }

function App() {
  return <main>
    <Canvas gl={{ antialias: true }} dpr={[1, 1.5]}>
      <color attach="background" args={[colors.darkModeAccent]} />
      {/* <OrbitControls /> */}
      <ScrollControls pages={6} damping={0.25}>
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
