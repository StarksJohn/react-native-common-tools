import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Image, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import ViewPropTypes from '../ViewPropTypes'
import EventListener from '../../tools/EventListener'
import constant from '../../constant/constant'

useAppStateListener.propTypes = {}

useAppStateListener.defaultProps = {}

/**
 * PureComponent
 * eg:
 *    useAppStateListener({
        onChange: (appState) => {
          console.log(`useAppStateListener onChange appState=`, appState)
        }
      })
 * @param props
 * @returns {*}
 * @constructor
 */
export default function useAppStateListener (props) {
  const dispatch = useDispatch()
  const {} = useSelector((state) => state)
  const { onChange } = props

  const _onChange = useCallback(({ appState, eventName }) => {
    console.log(`useAppStateListener useCallback,onChange appState=`, appState)

    onChange && onChange(appState)
  }, [onChange])

  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /*The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      console.log(`useAppStateListener componentDidMount`)

      //todo
      let eventListener = null
      if (onChange) {
        eventListener = new EventListener({
          eventName: constant.event.appStateChanged,
          eventCallback: _onChange
        })
      }
      //componentWillUnmount
      return () => {
        console.log(`useAppStateListener componentWillUnmount`)
        eventListener && eventListener.removeEventListener()
      }
    }, [])

  /*
  componentDidUpdate
  */
  useEffect(() => {
    console.log(`useAppStateListener componentDidUpdate`)
  })

}
