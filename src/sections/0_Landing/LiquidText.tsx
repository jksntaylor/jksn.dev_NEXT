import { useContext, useMemo, useRef } from "react"
import { PerspectiveCamera, RenderTexture, Text, useScroll } from "@react-three/drei"
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { Vector2, Vector3 } from "three"
import gsap from 'gsap'

import { t_landingMaterial } from "../../components/Materials"
import { ScreenContext } from "../../components/Providers"

import { colors } from "../../utils/constants"
import { lerp } from "../../utils/functions"
import { useMedia } from "../../utils/hooks"

const LiquidText = () => {
  // sizing
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  const screen = useContext(ScreenContext)
  const scrollData = useScroll()

  // shader refs
  const r_material = useRef<t_landingMaterial>(null!)
  const r_mouse = useRef({
    target: new Vector2(0, 0),
    actual: new Vector2(0, 0)
  })

  // memoized sizes
  const menuWidth = useMemo(() => {
    return screen.fullWidth ? width * 0.1 : screen.desktop ? width * 0.08 : width
  }, [screen, width])

  const text = useMemo(() => {
    return {
      x: -(width - menuWidth)/2,
      y: height / 2,
      factor: height * 0.088
    }
  }, [width, height])

  const plane = useMemo(() => {
    return {
      width: width - menuWidth,
      height: screen.mobile ? height - width * 0.23 : height,
      x: menuWidth / 2
    }
    }, [width, height, screen, menuWidth])

  // pointer handlers
  const handlePointerEnter = () => {
    return gsap.to(r_material.current, {
      u_mouse_rad: 0.2,
      duration: 0.85,
      ease: 'expo.out'
    })
  }

  const handlePointerLeave = () => {
    return gsap.to(r_material.current, {
      u_mouse_rad: 0,
      duration: 0.85,
      ease: 'expo.out'
    })
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) r_mouse.current.target.set(e.uv.x, e.uv.y)
  }
  // end pointer handlers

  const textOpts: {
    anchorX: "left",
    anchorY: "middle"
  } = useMemo(() => {
    return {
      anchorX: "left",
      anchorY: "middle",
      color: colors.dirtyWhite,
      fillOpacity: 1,
      font: '/fonts/NeueMontreal400.woff',
      letterSpacing: 0.04,
      outlineWidth: 0.03,
      outlineColor: colors.dirtyWhite,
      scale: new Vector3(width * 0.065, height * 0.09, 0.75)
    }
  }, [width, height])

  // animation frame
  useFrame((_state, delta) => {
    const sectionOffset = scrollData.range(0.05, 0.05)
    if (!r_material.current || sectionOffset === 1) {
      return;
    } else {
      // console.log('lqtxt')
      r_material.current.u_time += delta
      const { target, actual } = r_mouse.current
      if (target.distanceTo(actual) > 0.01) {
        const x = lerp(actual.x, target.x, 0.03)
        const y = lerp(actual.y, target.y, 0.03)
        r_material.current.u_mouse.set(x, y)
        actual.set(x, y)
      }
    }
  })
  // end animation frame

  return <mesh
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onPointerMove={e => handlePointerMove(e)}
    position={[plane.x, useMedia(0, 0, width * 0.115), 0]}
  >
    <planeGeometry args={[plane.width, plane.height, 2, 2]}/>
    <landingMaterial ref={r_material} u_mouse={new Vector2(0.9, 0)} u_mouse_rad={screen.mobile ? 0 : 0.2} u_aspect={width / height}>
      <RenderTexture attach="u_texture">
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 1, 0]}
        >JACKSON TAYLOR IS
        </Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 2, 0]}
        >A CREATIVE DEVELOPER</Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 3, 0]}
        >WITH AN EMPHASIS</Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 4, 0]}
        >IN INTERACTIVE WEB</Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 5, 0]}
        >ANIMATIONS, MOTION</Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 6, 0]}
        >DESIGN, & 3D ONLINE</Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 7, 0]}
        >EXPERIENCES</Text>
        <Text
          {...textOpts}
          position={[text.x, text.y - text.factor * 9, 0]}
        >BASED IN ALASKA</Text>
      </RenderTexture>
    </landingMaterial>
  </mesh>
}

export default LiquidText