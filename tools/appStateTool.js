import { AppState } from 'react-native'
import constant from '../constant/constant'

/**
 * eg :
 *      Object.defineProperty(appStateTool, 'appState', {
          set: (value) => {
            console.log('xxx.js defineProperty value=', value)
          }
        })
   or  listen appStateChanged event
 * @private
 */
const _AppStateTool = function () {
  console.log('AppStateTool.js construct ',)

  this.appState = 'active'

  const self = this

  this.subscribeAppState = () => {
    AppState.addEventListener('change', (nextAppState) => {

      console.log('appStateTool.js handleAppStateChange nextAppState=', nextAppState, ' self.appState=', self.appState)
      if (nextAppState === 'active' && self.appState !== 'active' && (self.appState?.match(/inactive|background/) || !self.appState) && nextAppState !== 'unknown') {
        if (self.appState !== nextAppState) {//Avoid sending two active events after the app switches back to the foreground
          console.log('appStateTool.js handleAppStateChange self.appState=', self.appState)
          console.log('appStateTool.js handleAppStateChange nextAppState=', nextAppState)
          self.appState = nextAppState
          gSendEvent(constant.event.appStateChanged,{appState:nextAppState})
        }
      } else if (nextAppState === constant.event.appState.inactive) {
        console.log('appStateTool.js handleAppStateChange nextAppState=', nextAppState)
        self.appState = nextAppState
        gSendEvent(constant.event.appStateChanged,{appState:nextAppState})

      } else if (nextAppState === constant.event.appState.background) {
        console.log('appStateTool.js handleAppStateChange nextAppState=', nextAppState)
        self.appState = nextAppState
        gSendEvent(constant.event.appStateChanged,{appState:nextAppState})
      }
    })
  }
  this.init()
}

_AppStateTool.prototype.init = function () {
  console.log('AppStateTool.js init')
  this.subscribeAppState()
}

const AppStateTool = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new _AppStateTool()
    }
    return instance
  }
})

export default new AppStateTool()()
