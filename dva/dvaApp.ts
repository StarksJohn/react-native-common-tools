import dva from './dva'
import models from './models'
import { modelProps } from './modelProps'

/**
 * 初始化dva 模块
 */
export default (modelList:modelProps[]) => {
  dva.createApp({
    models: models(modelList),
    enableLog: false
  })
}
