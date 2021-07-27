/**
 * 通用的 处理事件监听的 对象
 * EventListener.js
 */

import {
  DeviceEventEmitter
} from 'react-native'
import *as stringUtils from './stringTools'

/**
 * 任何地方都可调用的 发送 某个消息的 方法
 */
export const sendEvent =  (eventName, extraInfo = {}) =>{
  DeviceEventEmitter.emit(eventName, { ...extraInfo, eventName })
}

/**
 * 坑：不管此类的实例监听哪个eventName，只要 gSendEvent 调用后，所有 创建过的 此类的实例的 eventCallback 都会回调，所以 eventCallback 方法在 类里 判断了 是否 是 当前实例监听的事件才处理
 * eg:
 *    new EventListener({
      eventName: ,
      eventCallback: ({}) => {
      }
    })
 */
export default class EventListener {
  /**
   *
   * @param props {eventName:'', eventCallback:()=>{} }
   */
  constructor (props) {
    const { eventName, eventCallback } = props
    this.state = {
      eventName, eventCallback
    }
    this.listener = DeviceEventEmitter.addListener(eventName, (p) => {
      this.eventCallback(p, this)
    })
  }

  eventCallback (p, self) {
    if (!stringUtils.isNull(p.eventName) && p.eventName === self.state?.eventName) {
      self.state?.eventCallback(p)
    }
  }

  removeEventListener () {
    this.listener.remove()
  }
}
