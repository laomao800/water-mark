import { InitCofig } from './types'
import WaterMark from './WaterMark'

export default function initWaterMark(config: InitCofig) {
  return new WaterMark(config)
}
