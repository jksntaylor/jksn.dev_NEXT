// libraries
import { Html, useScroll } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useCallback, useEffect, useMemo, useRef } from "react"
import emailjs from '@emailjs/browser'
import gsap from "gsap"
// modules
import { colors } from "../utils/constants"
import { useMedia } from "../utils/hooks"
import { lerp } from "../utils/functions"
// assets
import Email from "../assets/svg/email"
import Star from "../assets/svg/star"

const Menu = () => {
  const scrollData = useScroll()
  const { camera, viewport } = useThree()
  const { height, width, factor } = viewport.getCurrentViewport(camera, [0, 0, 0])

  const r_drawer = useRef<HTMLDivElement>(null!)
  const r_path1 = useRef<SVGPathElement>(null!)
  const r_path2 = useRef<SVGPathElement>(null!)
  const r_path2b = useRef<SVGPathElement>(null!)
  const r_path3 = useRef<SVGPathElement>(null!)

  const r_contact = useRef<HTMLDivElement>(null!)
  const r_contactForm = useRef<HTMLFormElement>(null!)
  const r_contactName = useRef<HTMLInputElement>(null!)
  const r_contactEmail = useRef<HTMLInputElement>(null!)
  const r_contactCompany = useRef<HTMLInputElement>(null!)
  const r_contactBudget = useRef<HTMLInputElement>(null!)
  const r_contactBrief = useRef<HTMLTextAreaElement>(null!)
  const r_thanks = useRef<HTMLParagraphElement>(null!)

  const r_sliderText = useRef<HTMLSpanElement>(null!)

  const r_menuOpen = useRef(false)
  const r_contactOpen = useRef(false)

  const menuTL = useRef(gsap.timeline({ paused: true }))

  const toggleContact = useCallback(() => {
    if (!r_contactOpen.current) {
      gsap.to(r_contact.current, {
        top: 0,
        ease: 'expo.out',
        duration: 0.8
      })
    } else {
      gsap.to(r_contact.current, {
        top: '100%',
        ease: 'expo.inOut',
        duration: 0.8
      })
    }
    r_contactOpen.current = !r_contactOpen.current
  }, [])

  const toggleMenu = useCallback(() => {
    const container = document.querySelector('main > div > div > div') as HTMLDivElement
    if (!r_menuOpen.current) {
      container.style.overflow = 'hidden'
      menuTL.current.play()
    } else {
      container.style.overflow = 'hidden auto'
      menuTL.current.reverse()
    }
    r_menuOpen.current = !r_menuOpen.current
  }, [])

  const handleToggleContact = useCallback(() => {
    toggleContact()
    toggleMenu()
  }, [toggleContact, toggleMenu])

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && r_contactOpen.current) {
      e.stopImmediatePropagation()
      toggleContact()
    } else if (e.key === 'Escape' && r_menuOpen.current) {
      e.stopImmediatePropagation()
      toggleMenu()
    }
  }, [toggleContact, toggleMenu])

  const drawerWidth = useMedia(width - height * 0.156, width * 0.915 , 0)

  useEffect(() => {
    setTimeout(() => {
      menuTL.current.to([r_path1.current, r_path2.current, r_path3.current], {
        strokeDashoffset: "+=100%",
        stagger: 0.1,
        duration: 0.35,
        ease: 'power2.inOut'
      }).to(r_path1.current, {
        y: '200%',
        opacity: 0,
        duration: 0.5
      }, 0.6).to(r_path3.current, {
        y: '-200%',
        opacity: 0,
        duration: 0.5
      }, 0.6).to(r_path2.current, {
        strokeDasharray: '100% 0%',
        duration: 0.5
      }, 0.6).to(r_path2b.current, {
        opacity: 1,
        duration: 0.5
      }, 0.6).to(r_path2.current, {
        rotate: -75,
        scaleX: 1.2,
        duration: 0.75,
        transformOrigin: 'center',
        ease: 'expo.inOut'
      }, 0.85).to(r_path2b.current, {
        rotate: -165,
        scaleX: 1.2,
        duration: 0.75,
        transformOrigin: 'center',
        ease: 'expo.inOut'
      }, 0.85).to(r_drawer.current, {
        x: drawerWidth * factor,
        duration: 0.75,
        ease: 'expo.inOut'
      }, 0.85)
    }, 500);
      window.addEventListener('keydown', e => handleEscape(e))
      window.addEventListener('toggleContact', (handleToggleContact) as EventListener)
    return () => {
      window.removeEventListener('keydown', e => handleEscape(e))
      window.removeEventListener('toggleContact', (handleToggleContact) as EventListener)
    }
  }, [menuTL, factor, width, drawerWidth, handleEscape, handleToggleContact])

  const mouseEnter = () => {
    if (!r_menuOpen.current) menuTL.current.tweenTo(0.55)
  }

  const mouseLeave = () => {
    if (!r_menuOpen.current) menuTL.current.tweenTo(0)
  }

  const handleLinkClick = (index: number) => {
    window.dispatchEvent(new CustomEvent('handleMenuClick', { detail: index }))
    toggleMenu()
  }

  // START MenuLink COMPONENT
  const MenuLink: React.FC<{
    str: string,
    projIndex: number,
    altColor?: boolean
  }> = ({str, projIndex, altColor }) => {

    const r_link = useRef<HTMLDivElement>(null!)
    const r_cursor = useRef({ target: 0, value: 0 })
    const r_chars: { el: HTMLSpanElement, pos: number }[] = useMemo(() => [], [])
    const r_intensity = useRef({ value: 0 })

    const intensityTL = gsap.timeline({ paused: true }).to(r_intensity.current, { value: 1, duration: 0.35 })

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      intensityTL.play()
      const rect = r_link.current.getBoundingClientRect()
      r_cursor.current.value = (e.clientX - rect.left) / rect.width
    }

    const handleMouseLeave = () => { intensityTL.reverse() }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = r_link.current.getBoundingClientRect()
      r_cursor.current.target = (e.clientX - rect.left) / rect.width
    }

    const Character: React.FC<{char: string}> = ({char}) => {
      const r_span = useRef<HTMLSpanElement>(null!)
      useEffect(() => {
        const rect = r_link.current.getBoundingClientRect()
        r_chars.push({
          el: r_span.current,
          pos: (r_span.current.getBoundingClientRect().x - rect.left) / rect.width,
        })
      }, [])
      return <span style={{ display: 'inline-block', transformOrigin: 'bottom'}} ref={r_span}>
        {char.match(/[A-Z07]/g) ? <em>{char}</em> : char}
      </span>
    }

    const generateString = (str: string) => str.split('').map((c, i) => <Character char={c} key={i}/>)

    const animate = useCallback(() => {
      if (r_cursor.current.target !== r_cursor.current.value) r_cursor.current.value = lerp(r_cursor.current.value, r_cursor.current.target, 0.1)
      r_chars.forEach(char => {
        if (r_intensity.current.value > 0) {
            const strength = (0.75 - Math.min(Math.max(Math.abs(char.pos - r_cursor.current.value) * 3, 0), 0.75)) * r_intensity.current.value
            char.el.style.transform = `
              scale(${char.el.innerHTML === 'i' || char.el.innerHTML === "'" ? 1 + strength : 1}, ${1 + strength / 2})
              translateY(${strength * 15}%)
            `
            char.el.style.color = `color-mix(in srgb, ${altColor ? colors.darkModeAccent : colors.darkModeAccent_2} ${strength * 250}%, ${colors.dirtyWhite})`
            if (char.el.innerHTML !== 'i' && char.el.innerHTML !== "&nbsp;") char.el.style.fontWeight = `${200 + strength * 600}`
          } else if (char.el.style.fontWeight !== '200') {
            char.el.style.transform = `scale(1) translateY(0)`
            char.el.style.color = colors.dirtyWhite
            char.el.style.fontWeight = '200'
          }
      })
      requestAnimationFrame(animate)
    }, [altColor, r_chars])

    useEffect(() => {
      animate()
    }, [animate])

    return <div
      ref={r_link}
      className="menu_link"
      onMouseEnter={e => handleMouseEnter(e)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={e => handleMouseMove(e)}
      onClick={() => handleLinkClick(projIndex)}
    >
      {generateString(str)}
    </div>
  }
  // END MenuLink COMPONENT

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Math.max(Number(e.target.value) - 3, 0) / 0.47
    r_sliderText.current.style.left = `${percentage * 0.95}%`
    r_sliderText.current.innerText = `$${e.target.value}K`
  }

  const handleFormSubmit = () => {
    if (r_contactName.current.value && r_contactEmail.current.value && r_contactBrief.current.value) {
      emailjs.sendForm('default_service', import.meta.env.VITE_EMAIL_TEMPLATE, r_contactForm.current, import.meta.env.VITE_EMAIL_KEY).then(res => {
        console.log('email sent', res)
        gsap.to(r_contactForm.current.children, {
          opacity: 0,
          y: '10%',
          duration: 0.5,
          stagger: 0.1,
          ease: 'power1.out',
          pointerEvents: 'none'
        })
        gsap.to(r_thanks.current, {
          y: 0,
          opacity: 1,
          delay: 0.8
        })
      }, res => {
        console.log('send error', res)
        // ADD ERROR HANDLING
      })
    }
  }

  return <group>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      ref={r_drawer}
      className="menu_drawer"
      zIndexRange={[8, 9]}
      portal={{ current: scrollData.fixed }}
      position={[useMedia(-width + height * 0.208, -width * 0.885, 0), 0, 0]}
      style={{
        width: useMedia((width - height * 0.1) * factor, width * 0.945 * factor, 0),
        height: useMedia(height * factor + 2, height * factor + 2, 0)
      }}
    >
      <div className="menu_links">
        <div className="menu_links-projects">
          <span>PROJECTS<hr/></span>
          <div className="menu_links-flex">
            <MenuLink projIndex={0} str="tiKtok&nbsp;tOp&nbsp;moMents"/>
            <MenuLink projIndex={1} str="Rre&nbsp;ventUreS" altColor/>
            <MenuLink projIndex={2} str="gEnieS"/>
            <MenuLink projIndex={3} str="reaLtiMe&nbsp;roBoTics" altColor/>
            <MenuLink projIndex={4} str="leVi's&nbsp;501&nbsp;Day"/>
            <MenuLink projIndex={5} str="soURce&nbsp;7" altColor/>
            <MenuLink projIndex={6} str="huGe&nbsp;iNc"/>
            <MenuLink projIndex={7} str="BitsKi" altColor/>
            <MenuLink projIndex={8} str="bRaiNBasE"/>
            <MenuLink projIndex={9} str="iNtrOvOke" altColor/>
          </div>
        </div>
        <div className="menu_links-experiments">
          <span>EXPERIMENTS<hr/></span>
          <div className="menu_links-flex">
            <MenuLink projIndex={0} str="GRanD&nbsp;PriX" altColor/>
            <MenuLink projIndex={1} str="DisTOrtioN" />
            <MenuLink projIndex={2} str="WatEr&nbsp;RiPplEs" altColor/>
            <MenuLink projIndex={3} str="CaR&nbsp;CatWalK" />
            <MenuLink projIndex={4} str="POrtaL" altColor/>
          </div>
        </div>
        <button className="menu_opencontact" onClick={toggleContact}>LET'<em>S</em> T<em>A</em>LK →</button>
      </div>
      <div className="menu_teaser">
        <Star />
        <div>
          <span>Available for Freelance</span>
          <span>JACKSON TAYLOR</span>
          <span>February 2024</span>
        </div>
        <Star />
      </div>
      <div className="contact_form" ref={r_contact}>
        <form onSubmit={handleFormSubmit} ref={r_contactForm}>
          <p className="form_heading"><em>Ge</em>t I<em>n</em> T<em>ou</em>c<em>h</em></p>
          <div className="form_input">
            <label htmlFor="contact_name">Name<Star /></label>
            <input type="text" id="contact_name" name="name" ref={r_contactName}/>
          </div>
          <div className="form_input">
            <label htmlFor="contact_email">Email<Star /></label>
            <input type="text" id="contact_email" name="email" ref={r_contactEmail}/>
          </div>
          <div className="form_input">
            <label htmlFor="contact_company">Company</label>
            <input type="text" id="contact_company" name="company" ref={r_contactCompany}/>
          </div>
          <div className="form_slider">
            <label htmlFor="contact_budget">Estimated Budget</label>
            <div className="slider_wrapper">
              <span>$3K</span>
              <div>
                <span ref={r_sliderText}>$10K</span>
                <input
                  type="range" id="contact_budget" name="budget" ref={r_contactBudget}
                  min={3} max={50} step={1} defaultValue={10}
                  onChange={e => handleSliderChange(e)}
                />
              </div>
              <span>$50K+</span>
            </div>
          </div>
          <div className="form_textarea">
            <label htmlFor="contact_brief">Project Brief<Star /></label>
            <textarea id="contact_brief" name="description" ref={r_contactBrief}/>
          </div>
          <div className="form_buttons">
            <button className="form_close" type="button" onClick={toggleContact}><em>CLO</em>S<em>E</em></button>
            <button className="form_send" type="button" onClick={handleFormSubmit}><em>S</em>E<em>ND</em>→</button>
          </div>
        </form>
        <p className="contact_thanks" ref={r_thanks}>Thanks for reaching out!<br/>I'll be in touch as soon as I can.</p>
        <div className="email">
          <p className="email_heading"><em>O</em>T<em>HE</em>R IN<em>QU</em>IRI<em>E</em>S:</p>
          <a href="mailto:business@jksn.dev" className="email_link">
            business@jksn.dev
            <Email />
          </a>
        </div>
      </div>
    </Html>
    <Html
      center
      // transform
      // distanceFactor={3.4}
      className="menu"
      zIndexRange={[10, 11]}
      portal={{ current: scrollData.fixed }}
      position={[useMedia(-width / 2 + height * 0.05, -width/2 + width * 0.03 - 2/factor, 0), 0, 0.001]}
      style={{
        width: useMedia(height * 0.1 * factor, width * 0.055 * factor + 8, 0),
        height: useMedia(height * factor, height * factor, 0)
      }}
    >
      <svg onClick={toggleMenu} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} x="0" y="0" width="41" height="44" viewBox="0 0 41 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path ref={r_path1} d="M1.4 01.5L40 12" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="20%"/>
        <path ref={r_path2} d="M1.4 16.5L40 27" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="40%"/>
        <path ref={r_path2b} d="M1.4 16.5L40 27" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="100% 0%" strokeDashoffset="50%" opacity={0}/>
        <path ref={r_path3} d="M1.4 31.5L40 42" stroke={colors.dirtyWhite} strokeWidth="3" strokeDasharray="80% 20%" strokeDashoffset="60%"/>
      </svg>
    </Html>
  </group>
}


export default Menu
