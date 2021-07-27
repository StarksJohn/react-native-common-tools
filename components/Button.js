// import RN组件 代码模板
import React, { Component } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { Button } from 'native-base'
import PropTypes from 'prop-types'

/**
 * native-base 的 Button 的坑：
 * 1 如果 子元素是 Text，Text的 style会被 Button 自动加上 paddingLeft: 16, paddingRight: 16
 * 2 默认 自带边框，可通过 props里 设置 bordered={true}，style里设置 borderColor:'transparent' 来 隐藏 边框
 * 3 外部没传 height 时 ，native-base 会 自动设置 height=45，不管 给 Button.styles 设置 paddingTop 或 paddingBottom 都没用， 故 做了处理
 * 4 如果遇到设置了高度但是还是填充满了父节点的高度，可外部抱一个view，把 view的 高度设置成按钮想要的高度
 *
 * 优点：
 * 1 安卓点击效果类似原生
 */
export default class _Button extends Component {
  // 定义props类型
  static propTypes = {
    noGradientWhenPressed: PropTypes.bool,//按下时是否背景色渐变
    name: PropTypes.string, hideBorder: PropTypes.bool,
  }

  static defaultProps = {
    hideBorder: false
  }

  state={ height: this.props.style.height || 0 }

  // 构造方法
  // constructor (props) {
  //   // super(props) 注掉又 报错 Super expression must either be null or  a  function，故把 constructor 注掉
  //   // 定义state
  //   this.state =
  // }

  // 组件已装载
  componentDidMount () {
  }

  // 组件即将卸载
  componentWillUnmount () {
  }

  // 渲染组件
  render () {
    const { style, noGradientWhenPressed, name, hideBorder } = this.props
    const { height } = this.state
    const rest = {}
    if (noGradientWhenPressed) {
      rest.activeOpacity = 1
    }

    const restStyle = {}
    if (height === 0) {
      console.log(name, 'Button.js 没传 高度，先计算 children 的高，再 重设 按钮的 高')
      return <View {...this.props} style={[styles.container, style]} onLayout={
        (event) => {
          let { y, height } = event.nativeEvent.layout
          // console.log(name, 'Button.js children onLayout height=', height)
          this.setState({ height })
        }
      }>
        {this.props.children}
      </View>
    } else {
      restStyle.height = height
    }

    if (hideBorder) {
      restStyle.borderLeftWidth = 0
      restStyle.borderRightWidth = 0
      restStyle.borderTopWidth = 0
      restStyle.borderBottomWidth = 0
    }
    // console.log(name, 'Button.js  height=', height)
    // console.log(name, 'Button.js  restStyle=', restStyle)

    return (
      <Button {...this.props} style={[styles.container, style, { ...restStyle }]} {...rest} transparent={false}/*默认false，安卓会显示按钮的带阴影的边框;但是true时 又会 失去按下时
       的渐变效果*/
              bordered={true} onLayout={
        (event) => {
          let { y, height } = event.nativeEvent.layout
          // console.log(name, 'Button.js onLayout height=', height)
        }
      }>
        {this.props.children}
      </Button>
    )
  }
}

// 创建样式表
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    //为了移除 native-base 里的  Button 的 默认样式
    paddingTop: 0, alignSelf: 'center',
    paddingBottom: 0,
    borderRadius: 0,
    // backgroundColor: 'transparent'/*坑：不设置 backgroundColor，按钮默认会显示 蓝色背景,但设置 bordered={true} 后，背景色默认就变成了 透明*/,
    borderColor: 'transparent',

  }
})

