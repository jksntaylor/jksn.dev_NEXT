import { useContext, useEffect, useRef } from "react"
import '../styles/Preloader.scss'
import gsap from "gsap"
import { ScreenContext } from "./Providers"

const Preloader = () => {
  const r_wrapper = useRef<HTMLDivElement>(null!)
  const r_bar = useRef<HTMLDivElement>(null!)
  const r_num = useRef<HTMLDivElement>(null!)
  const screen = useContext(ScreenContext)

  const cachedPreloader = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        tl.kill()
      },
      onStart: () => { r_num.current.innerHTML = '53%' },
      defaults: {
        duration: 0.6,
        ease: 'expo.out'
      }
    }).to(r_bar.current, {
      width: '60%',
      onComplete: () => { r_num.current.innerHTML = '100%' }
    }).to(r_bar.current, {
      width: '95%'
    }).to(r_wrapper.current, {
      x: screen.mobile ? '0' : '100%',
      y: screen.mobile ? '100%' : '0',
      duration: 0.4,
      onComplete: () => { r_wrapper.current.hidden = true }
    })
  }

  const firstPreloader = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        tl.kill()
        window.sessionStorage.setItem('firstPreloaderRan', 'true')
      },
      onStart: () => { r_num.current.innerHTML = '18%' },
      defaults: {
        duration: 0.6,
        ease: 'expo.out'
      }
    }).to(r_bar.current, {
      width: '20%',
      onComplete: () => { r_num.current.innerHTML = '42%' }
    }).to(r_bar.current, {
      width: '50%',
      onComplete: () => { r_num.current.innerHTML = '71%' }
    }).to(r_bar.current, {
      width: '70%',
      onComplete: () => { r_num.current.innerHTML = '100%' }
    }).to(r_bar.current, {
      width: '95%',
    }).to(r_wrapper.current, {
      x: '100%',
      duration: 0.4,
      onComplete: () => { r_wrapper.current.hidden = true }
    })
  }

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        tl.kill()
        if (window.sessionStorage.getItem('firstPreloaderRan')) cachedPreloader()
        else firstPreloader()
      }
    }).to(r_num.current, {
      opacity: 1,
      duration: 0.8
    }, 0.8)
  }, [])

  return <div ref={r_wrapper} className="preloader__wrapper">
    <div ref={r_bar} className="preloader__bar" />
    <div ref={r_num} className="preloader__percentage">0%</div>
  </div>
}

export default Preloader
