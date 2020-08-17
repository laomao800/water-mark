export function getType(payload: any): string {
  return Object.prototype.toString.call(payload).slice(8, -1)
}

export function isPlainObject(payload: any): payload is { [key: string]: any } {
  if (getType(payload) !== 'Object') return false
  return (
    payload.constructor === Object &&
    Object.getPrototypeOf(payload) === Object.prototype
  )
}

export const parsePx = (input: any) => {
  let num = parseInt(input)
  num = !isNaN(num) ? num : 0
  return `${num}px`
}

export const getTextRect = (
  text: string,
  fontSize: number,
  lineHeight = '1.4'
) => {
  const $wrap = document.createElement('div')
  $wrap.style['display'] = 'inline-block'
  $wrap.style['whiteSpace'] = 'pre-wrap'
  $wrap.style['position'] = 'fixed'
  $wrap.style['opacity'] = '0'
  $wrap.style['fontSize'] = parsePx(fontSize)
  $wrap.style['lineHeight'] = lineHeight
  $wrap.innerHTML = text

  document.body.appendChild($wrap)
  const { width, height } = $wrap.getBoundingClientRect()
  document.body.removeChild($wrap)
  return { width, height }
}
