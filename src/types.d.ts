export interface InitConfig {
  /**
   * 水印挂载节点
   * @default document.body
   */
  el: string | HTMLElement

  /**
   * 水印文本
   */
  text: string

  /**
   * 水印文本颜色
   * @default '#000'
   */
  color?: string

  /**
   * 水印文字大小
   * @default 12
   */
  fontSize?: number

  /**
   * 水印透明度
   * @default 0.08
   */
  opacity?: number

  /**
   * 水印文本间隔，单位像素
   * @default 120
   */
  gap?: number

  /**
   * 水印文本旋转角度
   * @default -15
   */
  rotate?: number

  /**
   * 水印文本整体偏移量，[x轴, y轴]，单位像素
   * @default [0, 0]
   */
  offset?: [number, number]

  /**
   * 水印层 z-index 值
   * @default 999999
   */
  zIndex?: number
}
