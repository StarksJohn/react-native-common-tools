/**
 */
import React, { StyleSheet, Dimensions, PixelRatio, Platform, StatusBar, Image } from 'react-native'
import { ifIphoneX, dp } from '../tools/screenTools'

const appThemeColor = '#9E1F63'
const pageBackgroundColor = '#F9F9F9'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const pagePaddingHorizontal = dp(30)
const pageCellW = screenWidth - pagePaddingHorizontal * 2
const navBarH = (Platform.OS === 'ios' ? 44 : 56)
const blackText = '#212121'
const white = '#fff'

const _style = {
  screenWidth,
  screenHeight,
  pageCellW,
  navBarH,
  white,
  //没有 NavBar 控件时 页面顶部的 paddingTop
  // fullScreenPaddingTop: ifIphoneX({ paddingTop: dp(statusBarH) }, { paddingTop: dp(statusBarH) }, { paddingTop: dp(statusBarH) }),
  statusBarH: Platform.select({
    ios: ifIphoneX(44, 20),
    android: StatusBar.currentHeight
  }),
  ipxHeader: 40,//ipx顶部偏移量
  //ipx底部偏移量，以后被 safeAreaInsets.bottom  代替
  ipxBottomSpace:ifIphoneX(34, 0),
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
        (color.length == 6) ? color : arguments.callee(color)// 如果 本文件 'use strict';  此处的 callee 就报错
      })('')
  },
  appThemeColor,
  translucentColor: ({ r, g, b, a }) => {
    return `rgba(${r},${g},${b},${a})`
  },
  transparentColor: 'transparent',
  dp: dp,
  headerTitleStyle: { fontWeight: '600', fontSize: dp(18), color: '#fff', lineHeight: dp(24) },
  normalHeader: {
    headerStyle: { backgroundColor: appThemeColor },
    headerBackTitleVisible: false,
    headerLeftContainerStyle: {
      width: dp(50),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    // headerBackImage: CommonComp.headerBackImage
  },
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
  //二级页面的 statusBar的 styles,直接隐藏 node_modules/react-native-navbar/index.js 里的 statusBar
  // twoLevelPageStatusBar: {
  //   tintColor: 'red', animated: true, height: statusBarH,
  //   styles: 'dark-content', hidden: true, translucent: true
  // },
  animatedInput: {
    width: pageCellW, // dp(311),
    height: dp(56),
    borderWidth: dp(0.5),
    borderColor: '#757575', // paddingTop: dp(-5),
    borderRadius: dp(4),
    paddingHorizontal: dp(14)
  },
  animatedInput_styleBodyContent: { borderBottomWidth: 0 },
  animatedInput_styleLabel: {
    fontFamily: 'OpenSans-Light',
    textAlign: 'center',
    fontsize: dp(16),
    width: dp(115),
    lineHeight: dp(24),
    color: '#666',
    backgroundColor: pageBackgroundColor,
    marginTop: dp(Platform.OS === 'ios' ? 0 : 0)
  },
  animatedInput_styleInput: {
    fontSize: dp(16),
    lineHeight: dp(22),
    fontFamily: 'Open Sans',
    color: blackText,
    marginBottom: dp(10)
  },
  blackText,
  containerStyle: {
    paddingLeft: dp(32),
    paddingRight: dp(32)
  },
  btnStyle: {
    height: dp(48),
    lineHeight: dp(48),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: dp(4)

  },
  navBarRightBt: { width: dp(80), height: /* dp(Platform.OS === 'android' ? 50 : 40) */'100%', marginRight: dp(0), alignSelf: 'flex-end' },

  navBarRightBtText: { fontSize: dp(16), color: '#fff', fontWeight: '600', lineHeight: dp(24), alignSelf: 'center' },
  pagePaddingHorizontal,
  borderColor: '#EDEDED',
  absoluteFill: StyleSheet.absoluteFill,
  navTitle: {
    fontWeight: '600',
    fontSize: dp(18),
    color: '#fff',
    lineHeight: dp(24),
    alignSelf: 'center',
    marginBottom: dp(2)
  },
  /*
    ip12 pro max|ip12 : {left: 0, top: 47, right: 0, bottom: 34}
    ipx | ip xs max  : {left: 0, top: 44, right: 0, bottom: 34}
    ip11 : {left: 0, top: 48, right: 0, bottom: 34}
    ip8: {left: 0, top: 20, right: 0, bottom: 0}
   */
  safeAreaInsets:null,//不同设备安全区域相对物理屏幕的内边距,由具体项目的 react-native-safe-area-context 库的 useSafeAreaInsets 获取
}

export default _style
