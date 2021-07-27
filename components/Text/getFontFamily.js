// getFontFamily.js
import { Platform } from 'react-native'

/**
 * https://juejin.im/post/5ce66c26e51d4555fd20a2a0
 * （1）通过对 Text styles 的检测，拿到对应自定义字体
 （2）过滤掉 Text styles 中的 fontWeight fontStyle 得到新的 styles 对象
 */
// 声明项目中用到的所有字体配置。fontWeight参考 https://reactnative.cn/docs/text/
const fonts = {
  'PingFangSC-Regular': {
    fontWeight: '400'
  },
  'PingFangSC-Medium': {
    fontWeight: Platform.OS === 'ios' ? '500' : '700'
  },
  'PingFangSC-Semibold': {
    fontWeight: Platform.OS === 'ios' ? '700' : '800'
  }
}

/**
 * 因 项目里用的都是 Open Sans 字体，可根据 figma 里的 font-weight ，计算出
 *https://fonts.google.com/specimen/Open+Sans?query=sans&sidebar.open=true&selection.family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800#standard-styles 和 https://medium.com/@harshvitra/using-custom-fonts-in-react-native-52ebb3c51454   对应的 fontFamily
 * @type {{}}
 */
const _fontFamily = {
  normal: 'OpenSans-Light',
  300: 'OpenSans-Light',
  400: 'OpenSans-Regular',
  500: 'OpenSans-Regular',
  600: 'OpenSans-SemiBold',
  SemiBold: 'OpenSans-SemiBold',
  bold: 'OpenSans-bold',
  700: 'OpenSans-bold',
  800: 'OpenSans-ExtraBold'
}

/**
 * 根据 fontWeight 找到 fontFamily
 * @param styles
 */
export const fontWeightToFontFamily = (styles = {}) => {
  const { fontWeight } = styles
  let fontFamily = 'OpenSans-Regular'
  if (fontWeight) {
    fontFamily = _fontFamily[fontWeight]
  }
  // styles.fontFamily = fontFamily
  return { ...styles, fontFamily }
}

/**
 * 根据 fontWeight  在 fonts 对象里 找到 fontWeight; 弃用
 * @param baseFontFamily 字体名
 * @param styles Text组件的style
 * @returns {string}
 */
const getFontFamily = (baseFontFamily = 'PingFangSC-Regular', styles = {}) => {
  const { fontWeight } = styles
  let font = fonts[baseFontFamily]// 通过字体名拿到fonts对应的字体属性
  if (!font) {
    font = fonts['PingFangSC-Regular']
    baseFontFamily = 'PingFangSC-Regular'
  }
  if (!fontWeight) {
    const fw = font.fontWeight
    styles.fontWeight = fw
  }
  return baseFontFamily
}
