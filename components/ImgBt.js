/**
 * 基础的 可点击可加载网络|本地 的带菊花的图片 按钮控件
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'// https://www.npmjs.com/package/prop-types
import {
  Text,
  View,
  Image, ImageBackground,
  Platform, Easing,
  ViewPropTypes,
  StyleSheet,
  ActivityIndicator, Animated, DeviceEventEmitter, Dimensions
} from 'react-native'
import Button from './Button'
import PureComponent from './PureComponent'
import *as stringTools from '../tools/stringTools'

export default class ImgBt extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func, hideBorder: PropTypes.bool,
    onLoad: PropTypes.func, spin: PropTypes.bool,//是否360旋转 https://blog.csdn.net/hahahhahahahha123456/article/details/89155644
    imgStyle: Image.propTypes.style,//必须设置 ，否则 图片UI 不对
    style: ViewPropTypes.style,
    uri: PropTypes.string,//https网络图片地址
    renderLoadingView: PropTypes.func,
    imageSource: PropTypes.number,// eg:require('./image.jpg') 本地图时传此属性 ，
    shouldComponentUpdate: PropTypes.func, disabled: PropTypes.bool, resizeMode: PropTypes.string,
    localPath: PropTypes.number,//网络图片加载超时后显示的对应本地图片
    onTimeout: PropTypes.func,//网络图片加载超时回调
    timeInterval: PropTypes.number,//超时时间
    showLoadingView: PropTypes.bool,
  }

  static defaultProps = {
    onPress: null, showLoadingView: false,
    onLoad: () => {
    },
    style: {},
    imgStyle: {}, hideBorder: true,
    uri: '', resizeMode: 'cover',
    renderLoadingView: () => {
      return <View style={styles.loadingView}>
        <ActivityIndicator size='small' color='#888888' />
      </View>
    },
    imageSource: null, disabled: false,
  }

  constructor (props) {
    super(props)
    this.spinValue = new Animated.Value(0)

  }

  state = {
    loading: false

  }

  componentDidMount () {
    this.props.spin && this.spin()

  }

  //旋转方法
  spin = () => {
    this.spinValue.setValue(0)
    Animated.timing(this.spinValue, {
      toValue: 1, // 最终值 为1，这里表示最大旋转 360度
      duration: 4000,
      easing: Easing.linear
    }).start(() => this.spin())
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.shouldComponentUpdate) {
      return this.props.shouldComponentUpdate(nextProps, nextState)
    } else {
      return super.shouldComponentUpdate(nextProps, nextState)
    }
  }

  componentDidUpdate (prevProps, prevState) {

  }

  componentWillUnmount () {
  }

  onLoad () {

  }

  renderLoadingView () {
    console.log('ImgBt.js renderLoadingView')
    return this.props.showLoadingView && this.state.loading && this.props.renderLoadingView()
  }

  render () {
    const { style, onPress, onLoad, imgStyle, uri, imageSource, disabled, resizeMode, localPath, onTimeout, timeInterval, hideBorder, spin } = this.props
    let source = null, img = null

    //映射 0-1的值 映射 成 0 - 360 度
    const _spin = this.spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: ['0deg', '360deg'] //输出值
    })

    if (imageSource) {//本地图片
      source = imageSource
      img = <Image
        onLoad={
          () => {
            this.onLoad()
            onLoad()
          }
        }
        style={[styles.image, imgStyle]}
        source={source}
        resizeMode={resizeMode}
      />
    } else if (uri) {//网络图片
      source = { uri: uri }
      if (spin) {
        img = <Animated.Image style={[styles.image, imgStyle, { transform: [{ rotate: _spin }] }]} source={source} resizeMode={resizeMode} onLoad={
          () => {
            this.onLoad()
            onLoad()
          }
        } />
      } else {
        img = <Image style={[styles.image, imgStyle]} source={source} resizeMode={resizeMode}
                     onLoadStart={(e) => {
                       console.log('ImgBt.js onLoadStart uri=', uri)
                       this.setState({ loading: true })
                     }}
                     onProgress={(e) => {
                       // console.log('ImgBt.js onProgress uri=', uri)
                     }}
                     onLoad={
                       () => {
                         console.log('ImgBt.js onLoad uri=', uri)
                         this.onLoad()
                         onLoad()
                       }
                     }
                     onLoadEnd={(e) => {
                       console.log('ImgBt.js onLoadEnd uri=', uri)
                       this.setState(
                         {
                           loading: false
                         }
                       )
                     }}>
        </Image>
      }
    }

    return (
      <Button style={[styles.container, style]}
              onPress={
                () => {
                  onPress && onPress()
                }
              }
              disabled={disabled} hideBorder
      >
        {// 避免 uri='' && imageSource=null 时画的image 报 warning
          source && !disabled ? img : null
        }

        {this.props.children}
        {/*菊花*/}
        {
          !stringTools.isNull(uri) && this.renderLoadingView()
        }
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center', alignItems: 'center'
  },
  image: {
    backgroundColor: 'transparent',
    // resizeMode: 'cover'
  },
  loadingView: {// 菊花背景
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff'
    // borderColor: gColors.transparent,
  }
})
