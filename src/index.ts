import type { InitConfig } from './types'
import WaterMark from './WaterMark'

export default function renderWaterMark(config: string | InitConfig) {
  return new WaterMark(config).render()
}

export function createWaterMarkImage(config: string | InitConfig) {
  return new WaterMark(config).createWaterMarkImage()
}

export { WaterMark }
