import type { InitConfig } from './types'
import { parsePx, getTextRect, isPlainObject } from './utils'

const PX_RATIO = window.devicePixelRatio

function getDeg(deg: number) {
  return deg * (Math.PI / 180)
}

export default class WaterMark {
  private $el = document.body
  private $mask = null
  private text = ''
  private config: Partial<InitConfig> = {
    fixed: true,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.1)',
    gap: 10,
    rotate: -15,
    offset: 0,
    width: null,
    height: null,
    zIndex: 999999,
    debug: false,
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
  }

  private createMaskElm() {
    // const { dataURL, width, height } = this.createWaterMarkImage()
    const { dataURL } = this.createWaterMarkImage()
    const maskEl = document.createElement('div')
    maskEl.setAttribute('style', 'pointer-events:none;')
    maskEl.style.zIndex = String(this.config.zIndex)
    // maskEl.style.backgroundPosition = `${width}px ${height}px, 0 0`
    maskEl.style.backgroundImage = `url(${dataURL})`
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

    this.destroy()
    this.$el.prepend(maskEl)
    this.$el.dataset
    this.$mask = maskEl
  }

  createWaterMarkImage() {
    const { abs, sin, cos } = Math
    const { offset, fontSize, gap, rotate, debug, width, height } = this.config
    const { width: textWidth, height: textHeight } = getTextRect(
      this.text,
      fontSize
    )

    let gapX
    let gapY
    if (Array.isArray(gap)) {
      ;[gapX, gapY] = gap
    } else {
      gapX = gap || 0
      gapY = gap || 0
    }

    let offsetX
    let offsetY
    if (Array.isArray(offset)) {
      ;[offsetX, offsetY] = offset
    } else {
      offsetX = offset || 0
      offsetY = offset || 0
    }
    if (rotate < 0) {
      offsetY = offsetY + abs(textWidth * sin(getDeg(rotate)))
    }
    let _width = width
    if (!_width) {
      _width = abs(textHeight * cos(getDeg(rotate)))
      _width =
        Math.ceil(_width + offsetX) +
        abs(textWidth * cos(getDeg(rotate))) +
        gapX * 2
    }
    let _height = height
    if (!_height) {
      _height =
        abs(textWidth * sin(getDeg(rotate))) +
        abs(textHeight * cos(getDeg(rotate)))
      _height = Math.ceil(_height) + gapY
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const canvasWidth = (_width + gapX) * PX_RATIO
    const canvasHeight = (_height + gapY) * PX_RATIO
    const canvasOffsetLeft = offsetX * PX_RATIO
    const canvasOffsetTop = offsetY * PX_RATIO

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // ctx.translate(0, 0)
    const markWidth = canvasWidth * PX_RATIO
    const markHeight = canvasHeight * PX_RATIO
    if (debug) {
      ctx.strokeStyle = '#aaa'
      ctx.strokeRect(0, 0, markWidth, markHeight)
    }
    ctx.rotate(rotate * (Math.PI / 180))

    if (debug) {
      ctx.strokeStyle = '#369'
      ctx.strokeRect(0, 0, markWidth, markHeight)
    }
    ctx.font = `${this.config.fontSize}px Arial`
    ctx.fillStyle = this.config.color
    ctx.fillText(
      this.text,
      canvasOffsetLeft,
      canvasOffsetTop + fontSize * PX_RATIO
    )
    return {
      dataURL: canvas.toDataURL(),
      width: canvasWidth,
      height: canvasHeight,
    }
  }

  render() {
    this.createMaskElm()
    return this
  }

  destroy() {
    if (this.$mask) {
      this.$el.removeChild(this.$mask)
      this.$mask = null
    }
  }
}
