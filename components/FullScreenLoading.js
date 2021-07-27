// import RN组件 代码模板
import React from 'react'
import {
  Modal,
  Image,
} from 'react-native'
import { Toast } from 'teaset'
import Text from './Text/Text'
import { dp } from '../tools/screenTools'
import imgSource from '../res/imgs/imgSource'

let loadingKey = null

/**
 * 全屏中间显示加载中菊花
 * @param style
 * @param text
 * @param duration
 * @param position
 */
export default {
  /**
   * 加载中菊花
   * @param icon
   * @param text
   */
  showLoading (p) {
    p = {
      ...{ icon: <Image style={{ width: dp(50), height: dp(50) }} source={imgSource.loading} />, text: '加载中...' },
      ...p,
    }
    const { icon, text } = p
    loadingKey = Toast.show({
      style: {
        borderRadius: dp(10), paddingLeft: dp(30),
        paddingRight: dp(30),
        paddingTop: 0,
        paddingBottom: 0,
      },
      text: text,
      icon: icon,
      position: 'center',
      duration: 1000000, modal: true,
    })
  },

  hideLoading () {
    if (!loadingKey) return
    Toast.hide(loadingKey)
    loadingKey = null
  },
}
