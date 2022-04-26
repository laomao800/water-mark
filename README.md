# Water mark

## Install

```bash
yarn add @laomao800/water-mark

# or

npm install @laomao800/water-mark
```

## Usage

```js
import renderWaterMark, { createWaterMarkImage } from '@laomao800/water-mark'

renderWaterMark('Mark-text-43784')

createWaterMarkImage('Mark-text') // { dataURL: 'data:image/png;base64,xxxx', width: number, width: number }
```

## API

`waterMark(string | Options)`

```ts
export interface Options {
  /**
   * 水印文本
   */
  text: string

  /**
   * 水印挂载节点
   * @default document.body
   */
  el?: string | HTMLElement

  /**
   * 切换水印位置为固定位置显示或跟随滚动
   * @default true
   */
  fixed?: boolean

  /**
   * 水印文本颜色
   * @default '#000'
   */
  color?: string

  /**
   * 水印文字大小
   * @default 14
   */
  fontSize?: number

  /**
   * 水印文本间隔，单位像素，支持[x轴, y轴]
   * @default 120
   */
  gap?: number | [number, number]

  /**
   * 水印文本旋转角度
   * @default -15
   */
  rotate?: number

  /**
   * 指定水印画布宽度，默认自动计算，
   * 可在文字显示不完整时与 offset 配合调整偏移量
   * @default null
   */
  width?: number

  /**
   * 指定水印画布高度，默认自动计算，
   * 可在文字显示不完整时与 offset 配合调整偏移量
   * @default null
   */
  height?: number

  /**
   * 水印文本整体偏移量，单位像素，支持[x轴, y轴]
   * @default 0 [0, 0]
   */
  offset?: number | [number, number]

  /**
   * 水印层 z-index 值
   * @default 999999
   */
  zIndex?: number

  /**
   * 显示渲染调试辅助线
   * @default false
   */
  debug?: boolean
}
```
