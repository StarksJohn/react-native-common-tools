/**
 * 不同 业务逻辑的 数据放不同的 model里,最终组成最大的State
 * Put the states of different business logics into different models to form the largest state
 */
import _ from 'lodash'
import modelTools from './modelTools'
import { modelProps } from './modelProps'

export default function (modelList:modelProps[]) {
  const modelContainer = {}

  // @ts-ignore
  _.forEach(modelList, (it: { namespace: string; attributesToBeCached: string[] }) => {
    console.log('models.ts forEach it=', it)

    const namespace = _.isString(it) ? it : it.namespace
    console.log('models.ts namespace=', namespace)

    // @ts-ignore
    let modelObj = modelTools.createDefault({
      namespace,
      attributesToBeCached: it.attributesToBeCached
    })
    if (!_.isString(it)) {
      modelObj = _.merge(modelObj, it)
    }
    // @ts-ignore
    modelContainer[namespace] = modelObj
  })
  const models = _.values(modelContainer)
  console.log('models.js 最终models=', models)
  return models
}
