import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Scroll, ScrollControls } from '@react-three/drei'
import './App.scss'
import BorderedPlane from './components/BorderedPlane'
import { colors } from './utils/constants'
import Menu from './components/Menu'

const Scene = () => {
  const { viewport } = useThree()
  const { width, height } = viewport.getCurrentViewport()

  return <BorderedPlane
    width={width}
    height={height}
    factor={viewport.factor}
    background={colors.fadedBlack}
    border={colors.dirtyWhite}
  />
}

function App() {
  return <main>
    <Canvas gl={{ antialias: true }}>
      <color attach="background" args={[colors.darkModeAccent]} />
      {/* <OrbitControls enableZoom={false} /> */}
      <ScrollControls pages={3} damping={0.2}>
        <Menu />
        <Scroll>
          <Scene />
        </Scroll>
      </ScrollControls>
    </Canvas>
  </main>
}

export default App
