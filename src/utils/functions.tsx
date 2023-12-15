export const split = (text: string) => {
  let lineIdx = 0
  const lines: JSX.Element[][] = [[]]

  text.split('').forEach((char, i) => {
    if (char === '\n') {
      lines.push([])
      lineIdx++
    } else {
      lines[lineIdx].push(<span key={i}>{char}</span>)
    }
  })

  return lines.map((line, j) => <span key={j}>{line}</span>)
}

export const emphasize = (text: string) => text.split('').map((char, i) => (/[A-Z]/).test(char) ? <em key={i}>{char}</em> : char)

export const lerp = (x: number, y: number, t: number) => (1 - t) * x + t * y

