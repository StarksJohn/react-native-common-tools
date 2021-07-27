// import RN组件 代码模板
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet } from 'react-native'
import ViewPropTypes from './ViewPropTypes'
import PureComponent from './PureComponent'
import Button from './Button'
import Text from './Text/Text'

//按钮里有个纯文本的控件
export default class TextBt extends PureComponent {
  // 定义props类型
  static propTypes = {
    style: ViewPropTypes.style, onPress: PropTypes.func, title: PropTypes.string, textStyle: ViewPropTypes.style, disable: PropTypes.bool,
    numberOfLines: PropTypes.number, ellipsizeMode: PropTypes.string, hasPaddingLeftAndRight: PropTypes.bool,
  }

  static defaultProps = {
    style: {}, onPress: () => {

    }, numberOfLines: 1, ellipsizeMode: 'tail'
  }

  // 构造方法
  constructor (props) {
    super(props)
    // 定义state
    this.state = {}
  }

  // 组件已装载
  componentDidMount () {
    super.componentDidMount()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return super.shouldComponentUpdate(nextProps, nextState)
  }

  componentDidUpdate (prevProps, prevState) { }

  // 组件即将卸载
  componentWillUnmount () {
    super.componentWillUnmount()
  }

  // 渲染组件
  render () {
    const { style, onPress, textStyle, title, disable, numberOfLines, ellipsizeMode, hasPaddingLeftAndRight } = this.props
    const {} = this.state
    return (
      <Button style={style} disabled={disable}
              onPress={onPress}
      >
        <Text style={[styles.textStyle, textStyle]} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}
              hasPaddingLeftAndRight={hasPaddingLeftAndRight}>{title}</Text>
      </Button>
    )
  }
}

// 创建样式表
const styles = StyleSheet.create({
  textStyle: {//为了移除 native-base 里的  Text 的 默认样式
    paddingLeft: 0, paddingRight: 0
  }
})
