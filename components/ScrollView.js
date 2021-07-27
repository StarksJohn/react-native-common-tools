// import RN组件 代码模板
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet, ScrollView } from 'react-native'
import ViewPropTypes from './ViewPropTypes'
import PureComponent from './PureComponent'

/**
 * 坑：children 如果是 ScrollableTabView 时 ，会导致 ScrollableTabView 死循环 render
 */
export default class _ScrollView extends PureComponent {
  // 定义props类型
  static propTypes = {
    style: ViewPropTypes.style, onScroll: PropTypes.func,
    alwaysBounceVertical: PropTypes.bool,
    horizontal: PropTypes.bool,
    pagingEnabled: PropTypes.bool,
    contentContainerStyle: ViewPropTypes.style,
    onPageChanged: PropTypes.func,//pagingEnabled=true时，翻页后回调
  }

  static defaultProps = {
    style: {},
    alwaysBounceVertical: false,
    horizontal: false,
    pagingEnabled: false,
    contentContainerStyle: { alignItems: 'center', },
    onScroll: () => {
    }, onPageChanged: () => {
    }
  }

  // 构造方法
  constructor (props) {
    super(props)
    // 定义state
    this.state = {}
    this.page = 0/*pagingEnabled=true时 标记 当前在第几页*/
  }

  // 组件已装载
  componentDidMount () {
    super.componentDidMount()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return super.shouldComponentUpdate(nextProps, nextState)
  }

  //https://www.cnblogs.com/mengff/p/12574405.html
  componentDidUpdate (prevProps, prevState, spanshot) {
    return super.componentDidUpdate(prevProps, prevState, spanshot)
  }

  // 组件即将卸载
  componentWillUnmount () {
    super.componentWillUnmount()
  }

  // 渲染组件
  render () {
    const { style, alwaysBounceVertical, horizontal, pagingEnabled, contentContainerStyle, onScroll, children, onPageChanged, ...others } = this.props
    const {} = this.state
    return (
      <View style={[styles.container, style]}>
        <ScrollView style={{ flex: 1, }} {...others} contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
                    alwaysBounceVertical={alwaysBounceVertical} showsHorizontalScrollIndicator={alwaysBounceVertical} horizontal={horizontal}
                    pagingEnabled={pagingEnabled}
                    onMomentumScrollEnd={(event) => {
                      if (pagingEnabled) {
                        const pageWidth = event.nativeEvent.layoutMeasurement.width//分页时 每页的w
                        const contentOffset_x = event.nativeEvent.contentOffset.x//第0页相对scrollview最左边的x偏移量
                        const page = contentOffset_x / pageWidth
                        console.log('ScrollView onMomentumScrollEnd event.nativeEvent=', event.nativeEvent, ' \n  page=', page)
                        this.page = page
                        onPageChanged({ page })
                      }
                    }} onScroll={(nativeEvent) => {
          // console.log('ScrollView onScroll nativeEvent=', nativeEvent.nativeEvent)
          onScroll(nativeEvent)
        }}
        >
          {children}
        </ScrollView>
      </View>
    )
  }
}

// 创建样式表
const styles = StyleSheet.create({
  container: {},
  contentContainerStyle: { alignItems: 'center', }
})
