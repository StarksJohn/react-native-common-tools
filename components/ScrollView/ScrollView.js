import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { } from 'react-native'
import PropTypes from 'prop-types'
import { SpringScrollView } from 'react-native-spring-scrollview'
import MyStyleSheet from '../../styles/MyStyleSheet.js'

/**
 * PureComponent
 * @param props
 * @param parentRef
 * @returns {*}
 * @constructor
 */
const ScrollView = ({ style, contentStyle, textInputRefs, children }, parentRef) => {
  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /* The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      // todo
      console.log('ScrollView componentDidMount')

      // componentWillUnmount
      return () => {
        console.log('ScrollView componentWillUnmount')
      }
    }, [])

  /**
   * Methods of child components that can be directly called by the parent component
   */
  useImperativeHandle(parentRef, () => ({}), [])

  // render
  return (
  // https://bolan9999.github.io/react-native-spring-scrollview/#/zh-cn/V3/BasicContent 必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。SpringScrollView默认具有{flex:1}的样式，因此要使SpringScrollView正常工作，它的父容器必须是确定高度的，你也可以通过手动指定样式，使之正常工作。
  <SpringScrollView
    // style控制外层包裹视图的样式
    style={[styles.style, style]}
    // contentStyle控制内层视图的样式
    contentStyle={ [styles.contentStyle, contentStyle] }
    bounces={true} scrollEnabled={true} showsVerticalScrollIndicator={true}
    // 支持双向滑动的情况下(也就是 子节点的内容超过了 content 的范围)，控制一次滑动是否只允许水平或垂直一个方向
    directionalLockEnabled={true}
    // 拖拽 SpringScrollView 是否收起键盘
    dragToHideKeyboard={true}
    // 不同的系统，不同的三方输入法，键盘的工具栏高度是不确定的，并且官方没有给出获取工具栏高度的办法，这个属性用以给用户小幅调整键盘弹起时，组件偏移的位置
    inputToolBarHeight={44}
    // 当值为 true 时，滚动条会停在设置的pageSize整数倍位置。这个属性在iOS和安卓上都支持双向分页。
    pagingEnabled={false}
    // 配合pagingEnabled使用分页，使滑动停止在设置的整数倍位置。同时支持水平和垂直双向分页。0代表使用SpringScrollView的视口大小。
    pageSize={{ width: 0, height: 0 }}
    // 将TextInput的引用传入，让SpringScrollView自动管理键盘遮挡问题
    textInputRefs={textInputRefs}
    initialContentOffset={{ x: 0, y: 0 }}>
    {children}
  </SpringScrollView>
  )
}
ScrollView.propTypes = {
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  textInputRefs: PropTypes.array,
  children: PropTypes.element.isRequired
}
ScrollView.defaultProps = {}

const styles = MyStyleSheet.create({
  style: { width: '100%' },
  contentStyle: { width: '100%' }
})

export default memo(forwardRef(ScrollView))
