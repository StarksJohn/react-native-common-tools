/**
 * 网格view,可 外部自定义 绘制每个 格子的逻辑
 */
import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import ViewPropTypes from './ViewPropTypes'
import PureComponent from './PureComponent'

export const BaseGridViewStates = {
  Loading: 0, // 正在读接口
  fetchOk: 1, // 数据 拿到 成功
  fetchFail: 2 // 数据 拿失败
}

export default class BaseGridView extends PureComponent {
  static propTypes = {
    items: PropTypes.array, // 数据源
    renderItem: PropTypes.func, // 怎么画每个数据源
    renderLoadingStateView: PropTypes.func, // 画 加载状态的 视图
    renderFailStateView: PropTypes.func, // 画 无数据 状态
    fetchData: PropTypes.func, // 外部 container 决定 调哪个api 获取数据
    style: ViewPropTypes.style, // 拿到数据后,fetchOk 状态的 容器样式，为了在小屏时，每个item的位置正确，建议 设置 justifyContent:'space-between'
    changeSelectIndexEventName: PropTypes.string,// 改变网格里选择的 内容的 下标
    componentDidMount: PropTypes.func, componentWillUnmount: PropTypes.func, name: PropTypes.string,
    shouldComponentUpdate: PropTypes.func,
  }

  static defaultProps = {
    items: [],
    renderItem: () => {
      return null
    },
    changeSelectIndexEventName: '',
    renderLoadingStateView: () => {
    },
    renderFailStateView: () => {
    },
    fetchData: () => {
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      _state: BaseGridViewStates.fetchOk, items: props.items, width: props.width,
      selectIndex: -1// 网格里有多个选项时，当前选中的下标
    }
  }

  componentWillMount () {
    // this.fetchData();

  }

  fetchData () {
    if (this.props.items.length > 0) {
      this.setState({
        _state: BaseGridViewStates.fetchOk
      })
    }
  }

  componentDidMount () {
  }

  componentDidUpdate (prevProps, prevState, spanshot) {
    if (this.state.items !== this.props.items) {
      console.log(this.props.name + ' GridView.js componentDidUpdate 更新state=', this.props.items)
      this.setState({ items: this.props.items })
    }
  }

  componentWillUnmount () {
    // this.props.componentWillUnmount && this.props.componentWillUnmount(this)
    // if (this.changeSelectIndexEvent) {
    //   this.changeSelectIndexEvent.removeEventListener()
    // }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.shouldComponentUpdate) {
      return this.props.shouldComponentUpdate(nextProps, nextState)
    } else {
      const res = super.shouldComponentUpdate(nextProps, nextState)
      console.log(this.props.name + ' GridView.js shouldComponentUpdate=', res)
      return res
    }
  }

  render () {
    const { renderItem, style, renderLoadingStateView, renderFailStateView } = this.props
    const { items, _state, width } = this.state

    let content = null
    console.log(this.props.name + ' GridView.js render items=', items)
    switch (_state) {
      case BaseGridViewStates.Loading: {
        content = renderLoadingStateView()
      }
        break

      case BaseGridViewStates.fetchOk: {
        content = items.map((model, i) => {
          return renderItem(model, i, this)
        })
      }
        break

      case BaseGridViewStates.fetchFail: {
        content = renderFailStateView()
      }
        break
    }

    return (
      // 画容器
      <View style={[styles.container, style, { width }]}>
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {// 最大的容器 默认
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
    // justifyContent: 'space-around',导致某行只有一个子元素时，这个子元素 会 左右居中，而不是 左对齐
  }
})
