export const split = (text: string) => {
  return text.split('').map((character, index) => {
    if (/[A-Z]/.test(character)) {
      return <span key={index}><em>{character}</em></span>
    } else {
      return <span key={index}>{character}</span>
    }
  })
}
