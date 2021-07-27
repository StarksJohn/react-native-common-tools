import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Image, View, SafeAreaView, StyleSheet, Keyboard } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import appStyle from '../../styles/appStyle'
import ViewPropTypes from '../ViewPropTypes'

const { dp } = appStyle

useSubscribeKeyboard.propTypes = {}

useSubscribeKeyboard.defaultProps = {}

/**
 * PureComponent
 * eg:
 *    useSubscribeKeyboard({
        onKeyboardShow: ({ keyboardH }) => {
          console.log(`useSubscribeKeyboard onKeyboardShow keyboardH=`, keyboardH)
        },
        onKeyboardHide: () => {
          console.log(`useSubscribeKeyboard onKeyboardHide`)
        }
      })
 * @param props
 * @param parentRef
 * @returns {*}
 * @constructor
 */
export default function useSubscribeKeyboard (props) {
  const { onKeyboardShow, onKeyboardHide, onKeyboardChangeFrame } = props
  /**
   * keyboardH cannot be stored in the state. Otherwise, although the value in the current user-defined hooks is changed, the keyboardH obtained in the componentdidupdate of the current component after the parent component is rerender is still the original, so it can only be stored in the ref.current
   * @type {React.MutableRefObject<number>}
   */
  const r_keyboardH = useRef(0)

  const _onkeyboardShow = useCallback((e) => {
    console.log('useSubscribeKeyboard useCallback  _onkeyboardShow keyboardH', r_keyboardH.current)
    if (r_keyboardH.current === 0) {
      r_keyboardH.current = e.endCoordinates.height
      onKeyboardShow && onKeyboardShow({ keyboardH: e.endCoordinates.height })
    }
  }, [onKeyboardShow])

  const _keyboardHide = useCallback(() => {
    console.log('useSubscribeKeyboard useCallback  _keyboardHide keyboardH', r_keyboardH.current)
    if (r_keyboardH.current !== 0) {
      r_keyboardH.current = 0
      onKeyboardHide && onKeyboardHide()
      gSendEvent(gConstant.event.onKeyboardHide, {})
    }
  }, [onKeyboardHide])

  const _onKeyboardChangeFrame = useCallback((e) => {
    console.log('useSubscribeKeyboard useCallback  _onKeyboardChangeFrame keyboardH', r_keyboardH.current)
    r_keyboardH.current = e.endCoordinates.height
    onKeyboardChangeFrame && onKeyboardChangeFrame({ keyboardH: e.endCoordinates.height })
  }, [onKeyboardChangeFrame])

  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /* The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      console.log('useSubscribeKeyboard componentDidMount')

      let keyboardShowListener, keyboardHideListener, keyboardChangeFrameListener
      if (onKeyboardShow) {
        if (gIOS) {
          keyboardShowListener = Keyboard.addListener(
            'keyboardWillShow',
            _onkeyboardShow
          )
        } else {
          keyboardShowListener = Keyboard.addListener(
            'keyboardDidShow',
            _onkeyboardShow
          )
        }
      }
      if (onKeyboardHide) {
        if (gIOS) {
          keyboardHideListener = Keyboard.addListener(
            'keyboardWillHide',
            _keyboardHide
          )
        } else {
          keyboardHideListener = Keyboard.addListener(
            'keyboardDidHide',
            _keyboardHide
          )
        }
      }

      if (onKeyboardChangeFrame) {
        if (gIOS) {
          keyboardChangeFrameListener = Keyboard.addListener(
            'keyboardWillChangeFrame',
            _onKeyboardChangeFrame
          )
        }
      }

      // componentWillUnmount
      return () => {
        console.log('useSubscribeKeyboard componentWillUnmount')
        keyboardShowListener?.remove()
        keyboardHideListener && keyboardHideListener.remove()
        keyboardChangeFrameListener.remove()
      }
    }, [])

  /*
  componentDidUpdate
  */
  useEffect(() => {
    console.log('useSubscribeKeyboard componentDidUpdate keyboardH=', r_keyboardH.current)
  })
}
