/**
 */
import { StyleSheet, Dimensions, Platform } from 'react-native'
import { ifIphoneX } from '../tools/screenTools'
import { isIphoneX, getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper'
import MyStyleSheet from './MyStyleSheet'
import { SafeAreaViewProps } from 'react-native-safe-area-context'

const myStyleSheet = MyStyleSheet.create({
  pagePaddingHorizontal: 30
})

const appThemeColor = '#9E1F63'
const pageBackgroundColor = '#F9F9F9'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const pagePaddingHorizontal = myStyleSheet.pagePaddingHorizontal
// @ts-ignore
const pageCellW = screenWidth - pagePaddingHorizontal * 2
const navBarH = (Platform.OS === 'ios' ? 44 : 56)
const blackText = '#212121'
const white = '#fff'

let safeAreaInsets:SafeAreaViewProps['initialSafeAreaInsets']

const _style = {
  screenWidth,
  screenHeight,
  pageCellW,
  navBarH,
  white,
  // the height of the status bar: 44 for safe iPhoneX, 30 for unsafe iPhoneX, 20 for other iOS devices and StatusBar.currentHeight for Android.
  statusBarH: getStatusBarHeight(),
  ipxHeader: 40, // ipx顶部偏移量
  pageBackgroundColor,
  safeAreaView: {
    flex: 1, backgroundColor: appThemeColor
  },
  pageStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: pageBackgroundColor
  },
  disabledColor: '#D7D8D6',
  randomColor: () => {
    return '#' +
      (function (color) {
        return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)]) &&
        (color.length == 6)
          ? color
          : arguments.callee(color)// 如果 本文件 'use strict';  此处的 callee 就报错
      })('')
  },
  appThemeColor,
  translucentColor: (r: number, g: number, b: number, a: number) => {
    return `rgba(${r},${g},${b},${a})`
  },
  transparentColor: 'transparent',
  absoluteFull: {
    position: 'absolute', left: 0, top: 0, right: 0, bottom: 0
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  blueText: '#0275D8',
  grayText: '#666666',
  grayBorder: '#9E9E9E',
  animatedInput_styleBodyContent: { borderBottomWidth: 0 },
  blackText,
  pagePaddingHorizontal,
  borderColor: '#EDEDED',
  absoluteFill: StyleSheet.absoluteFill,
  /*
    ip12 pro max|ip12 : {left: 0, top: 47, right: 0, bottom: 34}
    ipx | ip xs max  : {left: 0, top: 44, right: 0, bottom: 34}
    ip11 : {left: 0, top: 48, right: 0, bottom: 34}
    ip8: {left: 0, top: 20, right: 0, bottom: 0}
   */
  safeAreaInsets, // 不同设备安全区域相对物理屏幕的内边距,由具体项目的 react-native-safe-area-context 库的 useSafeAreaInsets 获取
  isIphoneX: isIphoneX(),
  ifIphoneX,
  // the height of the bottom to fit the safe area: 34 for iPhone X and 0 for other devices.
  getBottomSpace
}

export default _style
