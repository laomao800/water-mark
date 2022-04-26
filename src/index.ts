import type { InitConfig } from './types'
import WaterMark from './WaterMark'

export default function initWaterMark(config: string | InitConfig) {
  return new WaterMark(config)
}
