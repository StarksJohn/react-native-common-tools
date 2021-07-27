// import RN组件 代码模板
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet } from 'react-native'
import ViewPropTypes from './ViewPropTypes'
import PureComponent from './PureComponent'
import Text from './Text/Text'
import Button from './Button'
import TextBt from './TextBt'

const _countNums = 60

//获取验证码按钮,带 倒计时 60秒
export default class VerificationCodeBt extends PureComponent {
  // 定义props类型
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: ViewPropTypes.style,
    getPhoneValue: PropTypes.func,
    beginCounting: PropTypes.func,
    disable: PropTypes.bool,
    countingTextStyle: ViewPropTypes.style
  }

  static defaultProps = {
    style: {}, beginCounting: () => {

    }
  }

  // 构造方法
  constructor (props) {
    super(props)
    // 定义state
    this.state = { counting: false, countNums: _countNums, title: '获取验证码', disable: props.disable }
  }

  // 组件已装载
  componentDidMount () {
    super.componentDidMount()
  }

  shouldComponentUpdate (nextProps, nextState) {
    const shouldComponentUpdate = super.shouldComponentUpdate(nextProps, nextState)
    // console.log('VerificationCodeBt.js shouldComponentUpdate=', shouldComponentUpdate)
    return shouldComponentUpdate
  }

  componentWillUpdate (nextProps, nextState) { }

  componentDidUpdate (prevProps, prevState, spanshot) {
    // console.log('VerificationCodeBt.js componentDidUpdate prevProps=', prevProps, '   props=', this.props)
  }

  // 组件即将卸载
  componentWillUnmount () {
    super.componentWillUnmount()
  }

  beginCounting () {
    if (this.state.counting) {
      return
    }
    this.props.beginCounting && this.props.beginCounting()
    this.setState({ counting: true, countNums: _countNums }, () => {
      this.interval = setInterval(() => {
        if (this.state.countNums > 1) {
          this.setState({
            countNums: this.state.countNums - 1
          })
          // console.log('剩余 ', this.state.countNums, '秒')
        } else {
          this.setState({
            countNums: _countNums, counting: false
          })
          clearInterval(this.interval)
        }
      }, 1000)
    })
  }

  reSet () {
    this.setState({
      countNums: _countNums, counting: false
    })
    clearInterval(this.interval)
  }

  // 渲染组件
  render () {
    const { style, textStyle, countingTextStyle } = this.props
    const { counting, countNums, title, disable } = this.state

    return (
      <TextBt style={style} title={counting ? countNums + 's' : title} textStyle={disable ? textStyle : countingTextStyle}
              onPress={async () => {
                this.beginCounting()

              }} disable={disable}
      >
      </TextBt>
    )
  }
}

// 创建样式表
const styles = StyleSheet.create({})

