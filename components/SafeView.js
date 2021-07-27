import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Image, View, SafeAreaView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import appStyle from '../styles/appStyle'
import AvoidBlankSpaceAtTheBottomOfSafeAreaView from './AvoidBlankSpaceAtTheBottomOfSafeAreaView'

const { dp } = appStyle

/**
 * PureComponent
 * @param props
 * @param parentRef
 * @returns {*}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const SafeView = ({ children }) => {
  // render
  return (
    <SafeAreaView style={[appStyle.safeAreaView, { backgroundColor: appStyle.appThemeColor }]}>
      <AvoidBlankSpaceAtTheBottomOfSafeAreaView color={appStyle.pageStyle.backgroundColor}></AvoidBlankSpaceAtTheBottomOfSafeAreaView>
      <View style={Styles.page}>
        {children}
      </View>
    </SafeAreaView>
  )
}

const Styles = StyleSheet.create({
  page: {
    ...appStyle.pageStyle
  }
})

SafeView.propTypes = {}

SafeView.defaultProps = {}

export default SafeView
