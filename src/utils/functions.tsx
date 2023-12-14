export const split = (text: string) => {
  return text.split('').map((character, index) => {
    if (/[A-Z]/.test(character)) {
      return <span key={index}><em>{character}</em></span>
    } else {
      return <span key={index}>{character}</span>
    }
  })
}

export const emphasize = (text: string) => text.split('').map((char, i) => (/[A-Z]/).test(char) ? <em key={i}>{char}</em> : char)

export const lerp = (x: number, y: number, t: number) => (1 - t) * x + t * y
