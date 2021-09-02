/* eslint-disable consistent-return */
import _ from 'lodash'
import objTools from '../tools/objTools'
import tool, { cacheAnAttributeOfInitStateProps } from '../tools/tool'
import asyncStorage from '../tools/asyncStorage'
import baseModel from './baseModel'

/**
 * 缓存 initState 的某个属性,如果这个属性再 attributesToBeCached 里注册了的话
 * @param key
 */
const cacheAnAttributeOfInitState = async ({ key, value, attributesToBeCached }:cacheAnAttributeOfInitStateProps) => {
  const index = _.indexOf(attributesToBeCached, key)
  if (index !== -1) {
    console.log('modelTools.js 开始缓存 initState.', key, ' 的值=', value)
    const [err, data] = await tool.to(asyncStorage.setItem(key, value))
    if (data) {
      console.log('modelTools.js 缓存 ', key, '成功')
    }
  }
}

interface createDefaultProps { namespace:string, attributesToBeCached :string[] }
interface saveSomeThingParams1 {
  action:string, payload: {}, callback():void
}
interface saveSomeThingParams2 {
  put(p:putParams):void, call():void, select():void
}
interface putParams {
  type: string, payload:object
}
/**
 * 创建默认model
 * https://dvajs.com/api/#model
 * effects: 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
 * @param namespace : 不能改为 nameSpace,因 Model 里定义的 就是 namespace
 * @returns {{effects: {}, namespace: *, reducers: {clear(): {}, save(*=, {payload: *}): *, saveSomeThing(*, {payload: *}): *}, state: {}}}
 */
const createDefault = ({ namespace, attributesToBeCached }:createDefaultProps) => {
  return {
    namespace,
    state: {},
    effects: {
      // modelTools.js 里的 每个 effects 都会注入到每个 Model 里
      // 通用的 具体控件发起的 effect,把 payload 发给对应的 reducer, 并且如果 action 在 attributesToBeCached 里注册过,就缓存 action 对应的 数据
      * [baseModel.baseEffects.saveSomeThing] (
        { action, payload, callback }:saveSomeThingParams1,
        { put, call, select }:saveSomeThingParams2
      ) {
        console.log(
          'modelTools.js effects saveSomeThing \n namespace=',
          namespace,
          '\n payload=',
          payload,
          '\n action=',
          action, ' \n callback=', callback
        )
        // const state = yield select((state) => state) //这里就获取到了当前state
        // console.log('testModel.js effects  全局state=', state)

        if (payload instanceof Object) {
          // 更新 当前 model 的 state
          yield put({ type: baseModel.baseAction.saveSomeThing, payload })

          // 缓存 某个Model的 initState里的某个字段的值
          // @ts-ignore
          yield cacheAnAttributeOfInitState({
            key: action,
            value: payload[action],
            attributesToBeCached
          })

          callback && callback()
        }
      }
    },

    // reducers 里的每个方法都会注入到每个Model里
    reducers: {
      clear () {
        return {}
      },
      [baseModel.baseAction.saveSomeThing] (state: object, { payload }: any) {
        // console.log("modelTools.js reducers saveSomeThing state=", state);
        // console.log("modelTools.js reducers saveSomeThing payload=", payload);
        const newState = {
          ...state,
          ...payload
        }
        console.log(
          'modelTools.js reducers saveSomeThing \n namespace=',
          namespace,
          ' \n state=',
          state,
          '\n payload=',
          payload,
          '\n newState=',
          newState
        )

        return newState
      }
    },
    /**
     * https://segmentfault.com/a/1190000039180929
     * 如果你需要订阅一些数据，并且处理数据后的逻辑仅与当前model相关，那么就应该用 subscriptions
     * subscripitons内的方法，无论任何命名，都会自动执行
     * subscriptions 中配置的只能dispatch所在model的reducer和effects。
     * subscriptions 中配置的函数只会执行一次，也就是在调用 app.start() 的时候，会遍历所有 model 中的 subscriptions 执行一遍。
     * subscriptions 中配置的函数需要返回一个函数，该函数应该用来取消订阅的该数据源。
     * history: react-router中的 history
     */
    subscriptions: {
      // 初始化缓存方法,每个model都会注入一次这个方法
      initCache: (params: { dispatch: any; history: any }) => {
        const { dispatch, history } = params
        console.log(
          'modelTools.js subscriptions initCache attributesToBeCached=',
          attributesToBeCached
        )
        // @ts-ignore
        return baseModel.baseSubscriptions.initCache({
          namespace,
          dispatch,
          history,
          attributesToBeCached
        })
      }
    }
  }
}

const ModelTools = {
  createDefault
}
export default ModelTools
