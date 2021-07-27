import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle, useReducer } from 'react'
import { Image, View, SafeAreaView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import appStyle from '../../styles/appStyle'

const { dp } = appStyle

useForceUpdate.propTypes = {}

useForceUpdate.defaultProps = {}

let initialState = 0

/**
 * PureComponent
 * eg: const forceUpdateDispatch = useForceUpdate()
 *     Call this(forceUpdateDispatch()) method when you need to force a refresh
 * @param props
 * @param parentRef
 * @returns {*}
 * @constructor
 */
function useForceUpdate (props) {
  const [curState, forceUpdateDispatch] = useReducer((state, action = '') => {
    console.log('useForceUpdate.js reducer state=', state)
    return state + 1
  }, initialState, () => {
    return initialState
  })

  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /*The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      //todo
      console.log(`useForceUpdate.js componentDidMount`)

      //componentWillUnmount
      return () => {
        console.log(`useForceUpdate.js componentWillUnmount`)
      }
    }, [])

  /*
  componentDidUpdate
  */
  useEffect(() => {
    console.log(`useForceUpdate.js componentDidUpdate curState=`, curState)
  }, [curState])

  //render
  console.log('useForceUpdate render curState=', curState)
  return forceUpdateDispatch
}

export default useForceUpdate

const Styles = StyleSheet.create({})
