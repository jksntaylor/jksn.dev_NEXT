import React, { useEffect, useState, createContext, useRef } from 'react'

export const ScreenContext = createContext({
  fullWidth: false,
  desktop: false,
  mobile: false
})

export const ScreenProvider: React.FC<{children?: React.ReactNode}> = ({ children }) => {

  const aspectRatio = useRef(window.innerWidth / window.innerHeight)
  const [screen, setScreen] = useState({
    fullWidth: aspectRatio.current >= 1.75,
    desktop: aspectRatio.current > 1 && aspectRatio.current < 1.75,
    mobile: aspectRatio.current < 1
  })

  useEffect(() => {
    const calcScreen = () => {
      aspectRatio.current = window.innerWidth / window.innerHeight
      setScreen({
        fullWidth: aspectRatio.current >= 2,
        desktop: aspectRatio.current > 1 && aspectRatio.current < 2,
        mobile: aspectRatio.current < 1
      })
    }

    window.addEventListener('resize', calcScreen)
    return () => {
      window.removeEventListener('resize', calcScreen)
    }
  }, [])

  return <ScreenContext.Provider value={screen}>
    {children}
  </ScreenContext.Provider>
}


export const DebugContext = createContext({
  debug: false
})

export const DebugProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

  const [debug, setDebug] = useState(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === 'y' || e.key === 'Y') {
      setDebug(prev => !prev)
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', e => handleKeyDown(e))
    return () => window.removeEventListener('keydown', e => handleKeyDown(e))
  }, [])

  return <DebugContext.Provider value={{debug}}>
    {children}
  </DebugContext.Provider>
} 