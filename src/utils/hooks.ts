import { useContext } from "react"
import { ScreenContext } from "../components/Providers"

export const useMedia = <Type>(fw: Type, d: Type, m: Type) => {
  const screen = useContext(ScreenContext)

  if (screen.fullWidth) return fw
  else if (screen.desktop) return d
  else return m
}
