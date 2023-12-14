export const projectData = [
{
  year: '2021',
  client1: 'Tiktok',
  client2: 'Bitski',
  role: 'Lead Creative Developer',
  link: 'https://tiktok.reformcollective.com',
  linkText: 'tiktok.reformcollective.com',
  title: <>Tiktok Top<br/><span><em>M</em>ome<em>n</em>ts</span></>,
  projectLink: '/projects/tiktok'
},
{
  awards: ['AWWWARDS | Site Of The Day & Developer Award', 'CSS Design Awards | Site Of The Day'],
  year: '2022',
  client1: 'RRE Ventures',
  role: 'Lead Creative Developer',
  link: 'https://rre.com',
  linkText: 'rre.com',
  title: <>RRE<br/><span><em>V</em>ent<em>u</em>res</span></>,
  projectLink: '/projects/rre'
},
{
  year: '2021',
  client1: 'Genies',
  role: 'Frontend Developer',
  link: 'https://genies.reformcollective.com',
  linkText: 'genies.reformcollective.com',
  title: <>Genies<br/><span>Fa<em>s</em>hi<em>on</em></span></>,
  projectLink: '/projects/genies'
},
{
  year: '2021',
  client1: 'Source 7',
  role: 'Frontend Developer',
  link: 'https://source7.com',
  linkText: 'source7.com',
  title: <>Source<br/><span>S<em>e</em>v<em>en</em></span></>,
  projectLink: '/projects/source7'
},
{
  year: '2021',
  client1: 'Realtime',
  client2: 'Robotics',
  role: 'Frontend Developer',
  link: 'https://rtr.ai',
  linkText: 'rtr.ai',
  title: <>Realtime<br/><span>Ro<em>b</em>oti<em>c</em>s</span></>,
  projectLink: '/projects/realtime'
},
{
  year: '2021',
  client1: "Levi's",
  client2: 'Bitski',
  role: 'Lead Frontend Developer',
  link: 'https://levis.bitski.com',
  linkText: 'levis.bitski.com',
  title: <>Levi's<br/><span>5<em>0</em>1 D<em>a</em>y</span></>,
  projectLink: '/projects/levis'
},
{
  year: '2022',
  client1: "Huge Inc",
  role: 'Lead Frontend Developer',
  link: 'https://hugeinc.com',
  linkText: 'hugeinc.com',
  title: <>Huge<br/><span>I<em>n</em>c</span></>,
  projectLink: '/projects/huge'
},
]

export type ProjectProps = {
  awards?: string[]
  year: string
  client1: string
  client2?: string
  role: string
  link: string
  linkText: string
  title: JSX.Element,
  projectLink: string
}
