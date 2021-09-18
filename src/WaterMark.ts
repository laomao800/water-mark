import type { InitConfig } from './types'
import { parsePx, getTextRect, isPlainObject } from './utils'

export default class WaterMark {
  private $el = document.body
  private $mask = null
  private text = ''
  private config: Partial<InitConfig> = {
    fixed: true,
    fontSize: 12,
    color: '#000',
    opacity: 0.08,
    gap: 120,
    rotate: -15,
    offset: [0, 0],
    zIndex: 999999,
  }

  constructor(def: string | InitConfig) {
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
    const maskEl = document.createElement('div')
    maskEl.setAttribute('style', 'pointer-events:none;')
    maskEl.style.zIndex = String(this.config.zIndex)
    maskEl.style.opacity = String(this.config.opacity)
    maskEl.style.backgroundImage = `url("${this.createMaskImage()}")`
    maskEl.style.width = '100%'
    maskEl.style.top = '0'
    maskEl.style.left = '0'

    if (this.$el === document.body) {
      maskEl.style.height = `${this.$el.scrollHeight}px`
      if (this.config.fixed) {
        maskEl.style.position = 'fixed'
      } else {
        this.$el.style.position = 'relative'
        maskEl.style.position = 'absolute'
      }
    } else {
      this.$el.style.position = 'relative'
      if (this.config.fixed) {
        const { height } = this.$el.getBoundingClientRect()
        maskEl.style.position = 'sticky'
        maskEl.style.height = parsePx(height)
        maskEl.style.marginBottom = parsePx(height * -1)
      } else {
        this.$el.style.position = 'relative'
        maskEl.style.position = 'absolute'
        maskEl.style.height = parsePx(this.$el.scrollHeight)
      }
    }

    this.$el.prepend(maskEl)
    this.$mask = maskEl
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
