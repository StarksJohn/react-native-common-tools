// import RN组件 代码模板
import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TextInput, View } from 'react-native'
import ViewPropTypes from './ViewPropTypes'
import PureComponent from './PureComponent'
import _SearchInput from 'teaset/components/SearchInput/SearchInput'
import { dp } from '../tools/screenTools'
import appStyle from '../styles/appStyle'

// 带 右侧 X按钮的 自定义 搜索控件，为了点击外部区域收起键盘，外层用 可用 Button 包起来
export default class SearchInput extends PureComponent {
  // 定义props类型
  static propTypes = {
    style: ViewPropTypes.style, // The outermost styles of the current component
    name: PropTypes.bool,
    searchInputStyle: ViewPropTypes.style, // teaset 里的 SearchInput 控件的 styles
    inputStyle: TextInput.propTypes.style, // RN 基础控件 TextInput 的style ,输入的内容 和 placeholder的 样式 通用
    iconSize: PropTypes.number/* 左侧🔍 icon的 大小，设置0可隐藏 */,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    placeholderTextColor: PropTypes.string,
    searchApi: PropTypes.func,
    autoFocus: PropTypes.bool,
    xBtStyle: ViewPropTypes.style,
    onKeyPress: PropTypes.bool,
    onXbtPress: PropTypes.func,
    showUnderLine: PropTypes.bool, // 是否显示下横线
    searcValue: PropTypes.string,
    returnKeyType: PropTypes.string,
    showXBt: PropTypes.bool,
    onChangeText: PropTypes.func,
    inputContainer: ViewPropTypes.style, // 可 定义 placeholder 的位置，如 justifyContent: 'start'
    // 就可让 placeholder 居左 ,
    placeholderContainer: ViewPropTypes.style,
    useEmoji: PropTypes.bool, // 是否支持输入 emoji
    selectionColor: PropTypes.string,
    caretHidden: PropTypes.bool,
    textAlignVertical: PropTypes.string
  }

  static defaultProps = {
    style: {},
    searchInputStyle: {},
    searcValue: '',
    showXBt: true,
    returnKeyType: 'search',
    inputContainer: {},
    iconSize: 0,
    placeholderContainer: {},
    useEmoji: false,
    selectionColor: appStyle.blackText,
    caretHidden: false,
    textAlignVertical: 'center'// Default cursor is centered up and down;If the cursor wants to be in the upper left corner when there are multiple lines on Android, it needs to be set to 'top'
  }

  // 构造方法
  constructor (props) {
    super(props)
    // 定义state
    this.state = { isFocused: false, searcValue: props.searcValue }
  }

  // 组件已装载
  componentDidMount () {
    super.componentDidMount()
  }

  shouldComponentUpdate (nextProps, nextState) {
    // console.log('SearchInput.js name=', this.props.name, ' shouldComponentUpdate=', shouldComponentUpdate, ' props=', this.props, ' nextProps=', nextProps)
    return super.shouldComponentUpdate(nextProps, nextState)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.searcValue !== this.state.searcValue) {
      // console.log('SearchInput.js componentDidUpdate name='+this.props.name+'  this.props.searcValue=', this.props.searcValue, ' this.state.searcValue=', this.state.searcValue)

      this.setState({ searcValue: this.props.searcValue })
    }
  }

  // 组件即将卸载
  componentWillUnmount () {
    super.componentWillUnmount()
  }

  clear () {
    this.searchInputR && this.searchInputR.clear()
  }

  blur () {
    this.searchInputR && this.searchInputR.blur()
  }

  focus () {
    this.searchInputR && this.searchInputR.focus()
  }

  // 渲染组件
  render () {
    const { style, searchInputStyle, returnKeyType, inputStyle, iconSize, placeholder, placeholderTextColor, searchApi, xBtStyle, children, onXbtPress, showXBt, onChangeText, inputContainer, onSubmitEditing, showUnderLine, name, onChange, onKeyPress, placeholderContainer, useEmoji, selectionColor, caretHidden, textAlignVertical, ...others } = this.props
    const { searcValue, isFocused } = this.state

    let _style = style

    if (showUnderLine) {
      _style = { ...style, ...{ borderBottomColor: '#CCCCCC', borderBottomWidth: StyleSheet.hairlineWidth } }
    }

    // console.log('SearchInput.js name=' + name, ' searcValue = ', searcValue)

    const self = this
    return (
      <View style={[styles.container, _style]}>
        <_SearchInput
          ref={
            (r) => {
              self.searchInputR = r
            }
          }
          {...others} caretHidden={caretHidden} selectionColor={selectionColor}
          textAlignVertical={textAlignVertical}// 避免安卓多行时 一开光标没有 在最顶部
          style={searchInputStyle}
          returnKeyType={returnKeyType}
          inputStyle={inputStyle}
          iconSize={iconSize}
          value={searcValue}
          placeholder={placeholder} placeholderTextColor={placeholderTextColor}
          inputContainer={inputContainer}
          placeholderContainer={placeholderContainer}
          onFocus={
            () => {
              self.setState({
                isFocused: true
              })
              this.props.onFocus && this.props.onFocus()
            }
          }
          onBlur={
            () => {
              self.setState({
                isFocused: false
              })
              this.props.onBlur && this.props.onBlur()
            }
          }
          onChange={({ nativeEvent: { eventCount, target, text } }) => {
            console.log('SearchInput.js onChange text=', text)
            if (!useEmoji) {
              if (!text.isEmoji()) {
                onChange && onChange(text)
              }
            } else {
              onChange && onChange(text)
            }
          }}
          onContentSizeChange={({ nativeEvent: { contentSize: { width, height } } }) => {
          }}
          onChangeText={text => {
            // console.log('SearchInput.js onChangeText text=', text)
            onChangeText && onChangeText(text)
          }}
          onKeyPress={({ nativeEvent: { key: keyValue } }) => {
            // console.log('SearchInput onKeyPress keyValue=', keyValue)
            onKeyPress && onKeyPress(keyValue)
          }}

          onSubmitEditing={
            async ({ nativeEvent }) => {
              self.setState({
                searcValue: nativeEvent.text
              }, async () => {
                searchApi && searchApi(searcValue)
                onSubmitEditing && onSubmitEditing(searcValue)
              })
            }
          }

        />
        {/* X按钮 */}
        {/* { */}
        {/*  (isFocused || (!stringTools.isNull(self.state.searcValue))) && showXBt ? */}
        {/*    <Button styles={[styles._xBtStyle, xBtStyle]} onPress={() => { */}
        {/*      self.setState({ */}
        {/*        searcValue: '', */}
        {/*      }, () => { */}
        {/*        onChangeText && onChangeText('') */}
        {/*      }) */}
        {/*    }}> */}
        {/*      <Image styles={{ width: dp(24), height: dp(24) }} source={imgSource.deleteIcon} /> */}
        {/*    </Button> */}
        {/*    : null */}
        {/* } */}
        {children}
      </View>
    )
  }
}

// 创建样式表
const styles = StyleSheet.create({
  _xBtStyle: {
    position: 'absolute',
    right: dp(10),
    width: dp(30),
    height: dp(30)
    // backgroundColor: _styles.randomColor()
  }
})
