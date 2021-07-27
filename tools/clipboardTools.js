import {
  Clipboard,
} from 'react-native'
import *as stringUtils from './stringTools'
import tool from './tool'

/**
 * 因 安卓经常 拿不到 粘贴板数据，故 多获取几次
 */
export default async function () {
  let textFromClipboard = ''
  let count = 20
  for (let i = 0; i < count; i++) {
    console.log('clipboardTools.js getClipboardStr i=', i)
    const [err, data] = await tool.to(Clipboard.getString())
    if (!stringUtils.isNull(data)) {
      textFromClipboard = data
      break
    }
  }
  console.log('clipboardTools.js getClipboardStr = ', textFromClipboard)
  return Promise.resolve(textFromClipboard)
}
