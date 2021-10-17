import _ from 'lodash'
import { ahooks, arrayTools, dateTools, Math, objTools, stringTools, tool } from 'full-stack-front-end-tools'

import asyncStorage from '../tools/asyncStorage'

interface initCacheProps {
  // any props that come into the component
  namespace:string,
  dispatch(p:object):void
  attributesToBeCached:string[]
}

/**
 *  * https://dvajs.com/api/#model
 */
export default {
  /**
   * 将要被缓存的属性,只需要在此添加key 以及在 effect 方法里 统一调
   * yield put({
        type: effects.cacheAnAttributeOfInitState,
        action,
        payload,
   });
   这个key 对应的value 就会 自动缓存 和 初始化
   * @type {string[]}
   */
  attributesToBeCached: [],
  baseEffects: {
    saveSomeThing: 'baseEffects/saveSomeThing', // 具体控件发的 effect,有 缓存 initState 的某个属性 作用
    awaitSaveSomeThing: 'baseEffects/awaitSaveSomeThing'
  },
  baseAction: {
    saveSomeThing: 'baseAction/saveSomeThing', // 触发 modelTools.js里的 reducers 的 saveSomeThing 的 action
    awaitSaveSomeThing: 'baseAction/awaitSaveSomeThing'
  },
  baseSubscriptions: {
    // 初始化缓存
    initCache: (props: initCacheProps) => {
      const { namespace, attributesToBeCached, dispatch } = props
      console.log(
        'baseModel.js subscriptions initCache namespace=',
        namespace,
        ' attributesToBeCached=',
        attributesToBeCached
      )
      _.forEach(attributesToBeCached, async (key: string) => {
        console.log('baseModel.js initCache forEach key=', key)
        const [e_value, value] = await tool.to(asyncStorage.getItem(key))
        console.log(
          'baseModel.js initCache forEach getItem key=',
          key,
          ' value=',
          value
        )
        if (objTools.isNotEmpty(value)) {
          const payload = { [`${key}`]: value }
          console.log('baseModel.js dispatch payload=', payload)

          dispatch({
            type: 'baseAction/saveSomeThing',
            payload
          })
        }
      })
    }
  }
}
