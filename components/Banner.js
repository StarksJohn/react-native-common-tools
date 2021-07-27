// import RN组件 代码模板
import React from 'react'
import PropTypes from 'prop-types'
import { Image, StyleSheet, ImageBackground, View } from 'react-native'
import ViewPropTypes from './ViewPropTypes'
import PureComponent from './PureComponent'
import { Carousel } from 'teaset'
import tool from '../tools/tool'

/**
 * 轮播图广告控件
 */
export default class Banner extends PureComponent {
  // 定义props类型
  static propTypes = {
    data: PropTypes.array,
    style: ViewPropTypes.style, api: PropTypes.func,
    renderItem: PropTypes.func, control: PropTypes.element/*包含小圆点的容器控件*/,
  }

  static defaultProps = {
    data: [], style: {},
    renderItem: () => {
    }, control: <Carousel.Control style={{ backgroundColor: 'red', position: 'absolute', bottom: (40), left: (16), }} dot={<View
      style={{
        width: (5),
        height: (5),
        backgroundColor: '#fff',
        borderRadius: (5),
        marginHorizontal: (2)
      }}></View>} activeDot={<View
      style={{
        width: (5),
        height: (5),
        backgroundColor: '#FF2135',
        borderRadius: (5),
        marginHorizontal: (2)
      }}></View>} />
  }

// 构造方法
  constructor (props) {
    super(props)
    // 定义state
    this.state = {
      data: props.data,
    }
  }

// 组件已装载
  async componentDidMount () {
    if (!this.state.data && this.props.api) {
      const [err, data] = await tool.to(this.props.api())
      if (data) {
        console.log('Banner.js 拿到api数据data=', data)
        this.setState({ data })
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return super.shouldComponentUpdate(nextProps, nextState)
    // return true
  }

  componentWillUpdate (nextProps, nextState) { }

  componentDidUpdate (prevProps, prevState) {
  }

// 组件即将卸载
  componentWillUnmount () {
  }

  startCarousel () {
    this.CarouselR.setupTimer()
  }

  stopCarousel () {
    this.CarouselR.removeTimer()
  }

  // 渲染组件
  render () {
    // alert('BizBanner.js render')

    const { style, renderItem, control } = this.props
    const { data } = this.state
    return data && data.length > 0 && <Carousel
      ref={
        (r) => {
          this.CarouselR = r
        }
      }
      style={style}
      control={
        control
      }
    >
      {
        data && data.map(
          (value, index, array) => {
            return renderItem(value, index, this)
          }
        ).filter(x => x)
      }
    </Carousel>
  }
}

// 创建样式表
const _styles = StyleSheet.create({})
