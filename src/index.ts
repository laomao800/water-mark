import type { InitConfig } from './types'
import WaterMark from './WaterMark'

export default function initWaterMark(config: InitConfig) {
  return new WaterMark(config)
}
