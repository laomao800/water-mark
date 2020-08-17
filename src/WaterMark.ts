import { parsePx, getTextRect, isPlainObject } from './utils'
import { InitCofig } from './types'

const BASIC_MASK_STYLE = `pointer-events:none;position:fixed;`

export default class WaterMark {
  private $el = document.body
  private $mask = null
  private text = ''
  private config: Partial<InitCofig> = {
    fontSize: 12,
    color: '#000',
    opacity: 0.08,
    gap: 120,
    rotate: -15,
    offset: [0, 0],
    zIndex: 999999,
  }

  constructor(def: string | InitCofig) {
    if (isPlainObject(def)) {
      this.config = { ...this.config, ...def }
      this.text = def.text

      if (typeof def.el === 'string') {
        this.$el = document.querySelector(def.el)
      } else if (def.el) {
        this.$el = def.el
      }
    } else {
      this.text = def
    }

    if (!this.$el) return

    this.createMask()
  }

  private createMask() {
    this.$mask = document.createElement('div')
    this.$mask.setAttribute('style', BASIC_MASK_STYLE)
    this.$mask.style.zIndex = this.config.zIndex
    this.$mask.style.opacity = this.config.opacity
    this.$mask.style.backgroundImage = `url("${this.createMaskImage()}")`

    if (this.$el === document.body) {
      this.$mask.style.top = 0
      this.$mask.style.left = 0
      this.$mask.style.width = '100%'
      this.$mask.style.height = '100%'
    } else {
      const { top, left, width, height } = this.$el.getBoundingClientRect()
      this.$mask.style.top = parsePx(top)
      this.$mask.style.left = parsePx(left)
      this.$mask.style.width = parsePx(width)
      this.$mask.style.height = parsePx(height)
    }

    this.$el.appendChild(this.$mask)
  }

  private createMaskImage() {
    const { width: textWidth, height: textHeight } = getTextRect(
      this.text,
      this.config.fontSize
    )
    const { abs, sin, cos } = Math
    const rotate = this.config.rotate
    const gap = this.config.gap

    let [offsetX, offsetY] = this.config.offset
    offsetX = offsetX + this.config.fontSize
    offsetY = offsetY + this.config.fontSize

    if (rotate < 0) {
      offsetY = offsetY + abs(textWidth * cos(rotate))
    }
    let width = abs(textWidth * sin(rotate)) + abs(textHeight * cos(rotate))
    let height = abs(textWidth * cos(rotate)) + abs(textHeight * sin(rotate))
    width = Math.ceil(width + offsetX) + abs(textWidth * cos(rotate)) + gap * 2
    height = Math.ceil(height) + gap

    const _genText = (x, y) =>
      `<text transform='translate(${x}, ${y}) rotate(${rotate})' fill='${color}' font-size='${this.config.fontSize}'>${this.text}</text>`
    const color = encodeURIComponent(this.config.color)
    const text1 = _genText(offsetX, offsetY)
    const text2 = _genText(offsetX + textWidth + gap / 2, offsetY + gap)
    const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='${height}px' width='${width}px'>${text1}${text2}</svg>`

    return svg
  }

  destroy() {
    this.$el.removeChild(this.$mask)
    this.$mask = null
  }
}
