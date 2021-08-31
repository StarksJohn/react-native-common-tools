import { StyleSheet } from 'react-native'
import {
  XWidget,
  ResetStyle
} from 'react-native-easy-app'
/**
 * https://developer.aliyun.com/article/764145
 */
XWidget.initResource('') // 网络图片的 Baseurl ,设置了之后，用图片的时候就只需要设置后缀就行了
  .initReferenceScreen(375, 677) // iphone 6 屏幕,为了让 使用 MyStyleSheet作为样式的控件 适配不同屏幕,达到自动缩放效果

/**
 * eg:
 *    import {  MyStyleSheet } from 'react-native-common-tools'
 *    const myStyleSheet = MyStyleSheet.create({
        v: {
          height: 50,
          fontSize: 16,
        },
      });
 */
const MyStyleSheet = {
  create (style: { row: { flex: number; justifyContent: string; alignItems: string } | { flex: number; height: number; justifyContent: string; alignItems: string }; mediaWrapper?: { width: string; height: string }; loadingImg?: { width: number; height: number }; line?: { position: string; left: number; right: number; bottom: number; height: number; backgroundColor: string }; v?: { width: number; height: number; backgroundColor: string }; text?: { color: string; alignSelf: string; fontSize: number }; input?: { height: number; backgroundColor: string } }) {
    console.log('MyStyleSheet.js create style=', style)
    const s = style
    let outKey
    for (outKey in s) {
      // @ts-ignore
      s[outKey] = ResetStyle(s[outKey])
    }
    console.log('MyStyleSheet.js s=', JSON.stringify(s))
    // @ts-ignore
    return StyleSheet.create(s)
  }
}

export default MyStyleSheet
