import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Image, View, SafeAreaView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import appStyle from '../styles/appStyle'

const { dp } = appStyle

/**
 * PureComponent
 * @param props
 * @param parentRef
 * @returns {*}
 * @constructor
 */
const AvoidBlankSpaceAtTheBottomOfSafeAreaView = ({color }, parentRef) => {

  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /*The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      //todo
      console.log(`AvoidBlankSpaceAtTheBottomOfSafeAreaView componentDidMount`)

      //componentWillUnmount
      return () => {
        console.log(`AvoidBlankSpaceAtTheBottomOfSafeAreaView componentWillUnmount`)
      }
    }, [])

  /*
  componentDidUpdate
  */
  useEffect(() => {
    console.log(`AvoidBlankSpaceAtTheBottomOfSafeAreaView componentDidUpdate`)
  })


  //render
  return (
    <View style={{ width: '100%', height: dp(200), position: 'absolute', bottom: 0, backgroundColor: color }} />
  )
}

AvoidBlankSpaceAtTheBottomOfSafeAreaView.propTypes = {
  color:PropTypes.string,
}

AvoidBlankSpaceAtTheBottomOfSafeAreaView.defaultProps = {
  color:'#fff'
}

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

const Styles = StyleSheet.create({})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(memo(forwardRef(AvoidBlankSpaceAtTheBottomOfSafeAreaView)))


