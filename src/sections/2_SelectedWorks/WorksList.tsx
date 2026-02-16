import { useContext, useMemo, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, useScroll } from "@react-three/drei"
import styled from "@emotion/styled"
import { Group, Mesh } from "three"

import WorksImage from "./WorksImage"
import { DebugContext, ScreenContext } from "../../components/Providers"
import { t_selectedWorksMaterial } from "./shader"
import { colors } from "../../utils/constants"
import { t_project } from "../../utils/types"
import { useMedia } from "../../utils/hooks"

const WorksList: React.FC<{ data: { case_study: { data: t_project }}[] }> = ({ data }) => {
  const screen = useContext(ScreenContext)
  const scrollData = useScroll()
  const { viewport } = useThree()
  const { width, height, factor } = viewport.getCurrentViewport()
  const debug = useContext(DebugContext)

  const r_works = useRef<Group>(null!)
  const r_worksInner = useRef<HTMLDivElement>(null!)
  const r_worksImages = useRef<Group & { children: (Mesh & { material: t_selectedWorksMaterial })[] }>(null!);

  const [delta, setDelta] = useState(0)
  const r_lastRange = useRef(0)

  const worksContainerHeight = useMedia(height * 0.92, height - width * .046, height - width * .35 + 2/factor) * 10 * factor
  const worksContainerOffsetY = useMemo(() => ((worksContainerHeight / 10) * 9) / factor, [worksContainerHeight, factor])

  useFrame(() => {
    const sidebarRange = scrollData.range(0.244, .025)
    const worksRange = scrollData.range(.275, .30)

    if (worksRange === r_lastRange.current) return;

    if (r_works.current) {
      if (!screen.mobile) {
        r_works.current.position.setX(width * (1 - sidebarRange) * 0.7125 + width * 0.08)
        setDelta((r_works.current.position.y - (worksRange * worksContainerOffsetY)) / 100)
        r_works.current.position.y = worksRange * worksContainerOffsetY
      }
    }

    r_works.current.position.y = worksRange * worksContainerOffsetY
    r_lastRange.current = worksRange
  })

  return <group position={[0, 0, 0]} ref={r_works}>
    <Html
      center
      // transform={debug.debug}
      // distanceFactor={debug.debug ? 3.4 : 0}
      portal={{ current: scrollData.fixed }}
      position={[0, -worksContainerHeight/2/factor + height / 2 - useMedia(height * 0.08, width * .046, width * .12), 0]}
      ref={r_worksInner}
      style={{
        width: useMedia(width - height * 0.96, width * .625, width + 2/factor) * factor,
        height: worksContainerHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
      }}
    >
      {data && data.map(
        (proj: { case_study: { data: t_project }}, i: number) => {
          const { data } = proj.case_study
          return <SelectedWork left={i % 1 ? true : false} key={i}>
            {data.awards[1] && <SelectedWorkAwards>
              {data.awards.map((award, i) => {
                return <Award key={i}>★&nbsp;{award.award}&nbsp;★</Award>
              })}
              </SelectedWorkAwards>}
              <SelectedWorkInfo>
                <InfoLine>
                  {data.year}
                  <br/>
                  {data.client1}
                  <br/>
                  {data.client2}
                </InfoLine>
                <InfoLine>
                  {data.role}
                  <br/>
                  <SelectedWorksLink
                    href={data.project_link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.project_link_text}
                  </SelectedWorksLink>
                </InfoLine>
              </SelectedWorkInfo>
              <SelectedWorkTitle dangerouslySetInnerHTML={{
                __html: data.project_title[0].text
              }}/>
              <SelectedWorkCTA>Vie<em>w</em> Project →</SelectedWorkCTA>
          </SelectedWork>
        })}
    </Html>
    <group
      position={[0, 0, 0]}
      ref={r_worksImages}
    >
      {data && data.map((proj: { case_study: { data: t_project }}, i: number) => {
        return <WorksImage url={proj.case_study.data.cover_image.url} key={i} index={i} delta={delta}/>
      })}

    </group>
  </group>
}

const SelectedWork = styled.article<{ left: boolean }>`
  color: ${colors.dirtyWhite};
  height: calc(100dvh - 4.6vw);
  position: relative;
  padding-top: 20%;
  ${props => props.left && `
    text-align: right;
  `}
  @media screen and (aspect-ratio > 1.8) {
    height: 92vh;
    padding-top: 15vh;
  }
  @media screen and (aspect-ratio < 1) {
    height: calc(100dvh - 35vw);
    padding: 0 7.5vw 10%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const SelectedWorkAwards = styled.div``

const Award = styled.span``

const SelectedWorkInfo = styled.div`
  font: 400 1.6rem/120% 'Neue Montreal';
  text-transform: uppercase;
  display: flex;
  text-align: right;
  padding-left: 5rem;
`

const InfoLine = styled.span`
  &:first-of-type {
    text-align: left;
    margin-right: 2.5rem;
  }
`

const SelectedWorksLink = styled.a`
  text-decoration: none;
  color: inherit;
  transition: all 300ms ease-in-out;
  position: relative;
  &::after {
    content: "";
    display: block;
    width: 0%;
    height: 0.1rem;
    position: absolute;
    background: ${colors.darkModeAccent};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;
  }
  &:hover {
    color: $${colors.darkModeAccent};
    &::after {
      width: 100%;
    }
    }
`

const SelectedWorkTitle = styled.h3`
  font: 400 15rem/100% 'Neue Montreal';
  text-transform: uppercase;
  letter-spacing: -0.03em;
  margin: 2.5rem auto 5rem;
  text-shadow: 0px 0px 2rem rgba(1, 1, 1, 0.6);
  span {
    font: 700 15rem/100% 'Formula Condensed';
    letter-spacing: 0.015em;
  }
  @media screen and (aspect-ratio > 1.8) {
    font-size: 17vh;
    margin: 3vh auto;
    span {
      font-size: 17vh;
    }
  }
  @media screen and (aspect-ratio < 1) {
    font-size: 15.5vw;
    margin: 10% 0 0;
    text-shadow: 0px 0px 3vw rgba(1, 1, 1, 0.5);
    span {
      font-size: 15vw;
    }
  }
`

const SelectedWorkCTA = styled.button`
  all: unset;
  cursor: pointer;
  border: 0.1rem solid $color-accent1;
  border-radius: 2.5rem;
  box-sizing: border-box;
  color: $color-accent1;
  font: 300 2.8rem/100% 'Formula Condensed';
  height: 5rem;
  margin-left: 5rem;
  padding: 1rem 2rem 0;
  text-transform: uppercase;
  transition: all 400ms ease;
  &:hover {
    box-shadow: 5px 5px 10px -5px $color-accent1, inset -5px -5px 25px -10px $color-accent1;
    color: $color-dirtywhite;
  }
  &:active {
    box-shadow: none;
    color: $color-dirtywhite;
  }
  @media screen and (aspect-ratio > 1.8) {
    font-size: 3.5vh;
    height: 6vh;
    padding: 1.5vh 2.5vh 0.5vh;
    border-radius: 3vh;
  }
  @media screen and (aspect-ratio < 1) {
    font-size: 6vw;
    border-radius: 6vw;
    border: 1px solid $color-accent1;
    height: 11vw;
    padding: 2vw 6vw 0;
    background: $color-fadedblack;
    margin-left: unset;
  }
`

export default WorksList