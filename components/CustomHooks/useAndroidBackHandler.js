import React, { useEffect, useCallback,   } from 'react'
import {  BackHandler, } from 'react-native'

/**
 * 监听设备上的后退按钮事件,可以调用你自己的函数来处理后退行为
 * 具体页面如果想在用户按下后退按钮后不退出自己页面,则可以使用此自定义hooks,传 handleBackPress 方法 进来
 * Added to the page component, used to exit the current page after clicking the return button of the device on Android
 * If a keyboard pops up in the page, after clicking the return button of Android device, the keyboard will be folded up first, and then it will exit the page
 * eg:
 *  useAndroidBackHandler({
    navigation
  })
 * @param props
 * @returns {*}
 * @constructor
 */
let lastClickTime = (new Date()).valueOf();
export default function useAndroidBackHandler (props) {
  const { navigation, handleBackPress/*此方法在外部定义时也要 return true,才能 拦截具体页面的 退出事件*/ } = props

  const _handleBackPress = useCallback(() => {
    console.log('useAndroidBackHandler handleBackPress')
    if (handleBackPress) {
      return handleBackPress()
    }

    /**
     * 避免安卓用户在首页时按后退按键后直接退出app
     * Prevent Android users from exiting the app directly after pressing the back button on the homepage
     */
    {
      // console.log('useAndroidBackHandler.js _handleBackPress navigation.dangerouslyGetState()=',navigation.dangerouslyGetState())
      // const { state } = navigation.dangerouslyGetState().routes[0];
      // console.log('useAndroidBackHandler.js _handleBackPress state=',state)
      /**
       * 若能返回上一页，则不拦截
       * If you can return to the previous page, do not block
       */
      if (navigation.canGoBack()) {
        return false;
      } else {
        let nowTime = (new Date()).valueOf();
        /**
         * 2次按下 后退按钮的间隔时间小于1秒才能退出app
         * The interval between pressing the back button twice is less than 1 second to exit the app
         */
        if (nowTime - lastClickTime < 1000) {
          console.log('useAndroidBackHandler 退出 app');
          BackHandler.exitApp();
        } else {
          console.log('useAndroidBackHandler 再按一次，退出 app');
          lastClickTime = nowTime;
        }
        return true;
      }
    }
    return false //返回false 时不会阻止事件冒泡传递，因而会执行默认的后退行为 https://reactnative.cn/docs/backhandler
  }, [handleBackPress])

  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /*The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      console.log('useAndroidBackHandler componentDidMount')

      //todo
      BackHandler.addEventListener('hardwareBackPress', _handleBackPress)

      //componentWillUnmount
      return () => {
        console.log('useAndroidBackHandler componentWillUnmount')
        BackHandler.removeEventListener('hardwareBackPress', _handleBackPress)
      }
    }, [])
}

