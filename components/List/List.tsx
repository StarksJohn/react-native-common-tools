import React, { useEffect, useRef, useState, useMemo, memo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Image, View, SafeAreaView, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native'
import PropTypes from 'prop-types'
import MyStyleSheet from '../../styles/MyStyleSheet'
import { objTools, tool } from 'starkfrontendtools'
import { LargeList, LargeListDataType, IndexPath } from 'react-native-largelist'
import { ChineseWithLastDateHeader, ChineseWithLastDateFooter } from 'react-native-spring-scrollview/Customize'
import { Offset } from 'react-native-spring-scrollview'

interface onRefreshProps { page: number }
interface sectionDataProps{ items: any[] }
interface renderIndexPathProps {
  section: number;
  row: number;
  mediaWrapperParam:any,
    rowData:any
}
type dataType=LargeListDataType
const initData:dataType = []

export interface Props {
  onRefresh:(props:onRefreshProps)=> Promise<any>,
    onLoading:(props:onRefreshProps)=> Promise<any>,
    heightForSection?:(section: number) =>number,
    renderSection?:(section:number)=>React.ReactElement<any>,
    heightForIndexPath:(indexPath:IndexPath)=> number,
    renderIndexPath:(indexPath: renderIndexPathProps) => React.ReactElement<any>
}
/**
 * eg:
 * <List ref={refList} onRefresh={({ page }) => {
          return new Promise((resolve, reject) => {
          })
        }} onLoading={({ page }) => {
          return new Promise((resolve, reject) => {
          })
        }} heightForIndexPath={({ section, row }) => {
        }} renderIndexPath={({ section, row, mediaWrapperParam, rowData }) => {
          return (
          )
        }}></List>
 * @param props
 * @param parentRef
 * @returns {*}
 * @constructor
 */
const List :React.FC<Props> = (Props, parentRef) => {
  const { onRefresh, onLoading, heightForSection, renderSection, heightForIndexPath, renderIndexPath } = Props
  const refLargeList = useRef(null)
  /**
   *  数组里每个{}代表一页数据,eg:[ {items:[]} ]
   */
  const [data, setData] = useState(initData)
  const [allLoaded, setAllLoaded] = useState(false)
  const refPage = useRef(1)// 当前页数

  const _renderSection = useCallback((section) => {
    if (renderSection) {
      renderSection(section)
    } else {
      return null
    }
  }, [data])
  const _renderIndexPath = useCallback(
    ({ section, row }, mediaWrapperParam) => {
      if (renderIndexPath) {
        console.log('List.js _renderIndexPath data=', data)
        console.log('List.js _renderIndexPath section=', section, ' row=', row)
        const sectionData:sectionDataProps = data[section]
        // console.log('List.js _renderIndexPath sectionData=', sectionData)
        const items = sectionData.items
        // console.log('List.js _renderIndexPath items=', items)
        const rowData = items[row]
        console.log('List.js _renderIndexPath rowData=', rowData)

        return renderIndexPath({ section, row, mediaWrapperParam, rowData })
      } else {
        return null
      }
    },
    [data]
  )
  // const _renderHeaderBackground = useCallback(
  //   () => {
  //     return <ImageBackground style={{ flex: 1 }} source={''} />
  //   },
  //   []
  // )
  // const _renderHeader = useCallback(
  //   () => {
  //     return (
  //       <TouchableOpacity onPress={() => console.log('_renderHeader')}>
  //         <Text style={styles.header}>I am header</Text>
  //       </TouchableOpacity>
  //     )
  //   },
  //   []
  // )
  // const _renderFooter = useCallback(
  //   () => {
  //     return (
  //       <TouchableOpacity onPress={() => console.log('_renderFooter')}>
  //         <Text style={styles.header}>I am Footer</Text>
  //       </TouchableOpacity>
  //     )
  //   },
  //   []
  // )
  const scrollTo = useCallback(
    ({ x, y }) => {
      // @ts-ignore
      refLargeList?.current.scrollTo({ x, y }, true).then().catch()
    },
    [refLargeList]
  )
  const scrollToIndexPath = useCallback(
    ({ section, row }, animated) => {
      // @ts-ignore
      refLargeList?.current.scrollToIndexPath({ section, row }, animated).then().catch()
    },
    [refLargeList]
  )
  const resetoNoData = useCallback(
    () => {
      console.log('List.js resetoNoData')
      // @ts-ignore
      refLargeList?.current.endRefresh()// 完成数据请求以后结束动画
      refPage.current = 1
      setData([])
      setAllLoaded(true)
    },
    [data]
  )
  const _onRefresh = useCallback(
    async () => {
      console.log('List.js _onRefresh onRefresh=', onRefresh)
      if (onRefresh) {
        const [err, newArr] = await tool.to(onRefresh({ page: 1 }))
        console.log('List.js onRefresh await newArr=', newArr, ' err=', err)
        if (newArr) { // {items:[]}
          // @ts-ignore
          refLargeList?.current.endRefresh()// 完成数据请求以后结束动画
          refPage.current = 1
          setData([{ items: newArr }])
          setAllLoaded(false)
        } else {
          resetoNoData()
        }
      } else { // 外部没有提供数据源,表示列表无数据
        console.log('List.js onRefresh endRefresh')
        resetoNoData()
      }
    },
    [data]
  )
  const _onLoading = useCallback(
    async () => {
      console.log('List.js _onLoading onLoading=', onLoading)
      if (onLoading) {
        const [err, newArr] = await tool.to(onLoading({ page: refPage.current + 1 }))
        console.log('List.js onLoading await newArr=', newArr, ' err=', err)
        if (newArr) {
          // @ts-ignore
          refLargeList?.current.endLoading()
          refPage.current += 1
          // @ts-ignore
          const newData:LargeListDataType = [].concat(data)
          newData.push({ items: newArr })
          console.log('List.js _onLoading 列表新的数据源=', newData)
          setData(newData)
        } else { // 没有新数据
          console.log('List.js _onLoading 没有新数据')
          // @ts-ignore
          refLargeList?.current.endLoading()
          setAllLoaded(true)
        }
      } else {
        // @ts-ignore
        refLargeList?.current.endLoading()
        setAllLoaded(true)
      }
    },
    [data]
  )
  const _heightForSection = useCallback(
    (section) => {
      if (heightForSection) {
        heightForSection(section)
      } else {
        return 0
      }
    },
    [data]
  )
  const _heightForIndexPath = useCallback(
    ({ section, row }) => {
      if (heightForIndexPath) {
        return heightForIndexPath({ section, row })
      } else {
        return 0
      }
    },
    [data]
  )

  /**
   * componentDidMount && componentWillUnmount
   */
  useEffect(
    /* The async keyword cannot be added to the first parameter https://juejin.im/post/6844903985338400782#heading-27 */
    () => {
      // todo
      console.log('List componentDidMount')
      // @ts-ignore
      refLargeList?.current.beginRefresh()

      // componentWillUnmount
      return () => {
        console.log('List componentWillUnmount')
      }
    }, [])

  /**
   * Methods of child components that can be directly called by the parent component
   */
  useImperativeHandle(parentRef, () => ({
    beginRefresh: () => {
      console.log('List.js beginRefresh')
      // @ts-ignore
      refLargeList?.current.beginRefresh()
    },
    /**
     * 使用代码滑动到指定位置
     * @param x
     * @param y
     */
    scrollTo: ({ x, y }:Offset) => {
      console.log('List.js scrollTo x=', x, ' y=', y)
      scrollTo({ x, y })
    },
    /**
     * 用代码滑动到指定的偏移(IndexPath),如果row===-1，则表示滑动到相应的组头
     */
    scrollToIndexPath: ({ section, row }:IndexPath, animated = true) => {
      console.log('List.js scrollToIndexPath section=', section, ' row=', row)
      scrollToIndexPath({ section, row }, animated)
    }
  }), [])

  // useEffect(() => {
  //   console.log('List allLoaded has changed to =', allLoaded)
  // }, [allLoaded])
  // useEffect(() => {
  //   console.log('List.js data has changed to =', data)
  // }, [data])

  // render
  console.log('List.js render data=', data)
  // https://bolan9999.github.io/react-native-largelist/#/zh-cn/V3/SupportedProps
  // @ts-ignore
  return (
    <LargeList
      ref={ref => {
        console.log('List.js ref=', ref)
        if (objTools.isNotEmpty(ref)) {
          refLargeList.current = ref
        }
      }}
      style={styles.container}
      // 选择下拉刷新的组件，用户如果不希望高度自定义，则可以不设定直接使用NormalHeader,如果需要高度自定义，请参看自定义下拉刷新
      refreshHeader={ChineseWithLastDateHeader}
      // 下拉刷新的回调函数,如果设置了此属性，则会在顶部加一个刷新的Header; 不能和 renderHeader 同时存在
      onRefresh={_onRefresh}
      // { items: any[] }[] 二维数组,外层数组表示吸顶Section的数量，内层的items数组表示每个Section下有多少个Items
      data={data}
      // 初始化偏移，仅第一次初始化有效，后期更改无效（已支持x方向）
      initialContentOffset={{ x: 0, y: 0 }}
      // 返回列表每一组组头高度的函数
      heightForSection={_heightForSection}
      renderSection={_renderSection}
      // 返回列表每一行高度的函数 (indexPath: IndexPath) => number;不等高时,得指定每行的高度
      heightForIndexPath={_heightForIndexPath}
      // 每一行的render函数, mediaWrapperParam是用于大图片或视频优化选项。(indexPath: IndexPath, mediaWrapperParam:Object) => React.ReactElement <any> ;
      renderIndexPath={_renderIndexPath}
      // 列表的头部组件函数; 不能和 onRefresh 同时存在
      // renderHeader={_renderHeader}
      // renderScaleHeaderBackground={_renderHeaderBackground}
      // 列表的尾部组件函数;不能和 loadingFooter 同时存在
      // renderFooter={_renderFooter}
      // 上拉加载组件，用户如果不希望自定义，则可以使用NormalFooter,如果需要高度自定义，请参看上拉加载;不能和 renderFooter 同时存在
      loadingFooter={ChineseWithLastDateFooter}
      // 上拉加载的回调函数; 如果设置了此属性，则会在底部加一个加载组件
      onLoading={_onLoading}
      // 告诉 LargeList 所有数据是否加载完成。如果true,底部就不会触发 onLoading,也就不会再 翻页
      allLoaded={allLoaded}
      // 滑动超出内容视图后是否可以弹性地继续滑动(iOS & Android，如果为true，水平方向内容视图如果没有超过SpringScrollView则不会有弹性，垂直方向始终具有弹性）
      bounces={true}
      // 是否可以滚动
      scrollEnabled={true}
      // 显示垂直滚动指示器
      showsVerticalScrollIndicator={true}
      // 显示水平滚动指示器（内容视图超出LargeList视口才有用）
      showsHorizontalScrollIndicator={true}
      // 点击LargeList是否收起键盘
      tapToHideKeyboard={true}
      // 翻转滚动方向，适配聊天App，查看示例 ChatExample .
      inverted={false}
      // 当值为 true 时，滚动条会停在设置的pageSize整数倍位置。这个属性在iOS和安卓上都支持双向分页。
      pagingEnabled={false}
      // 配合 pagingEnabled 使用分页，使滑动停止在设置的整数倍位置。同时支持水平和垂直双向分页。0代表使用LargeList的视口大小。
      pageSize={{ width: 0, height: 0 }}
      // 手指按下时回调
      // onTouchBegin={()=>console.log("onTouchBegin")}
      // 手指抬起时回调
      // onTouchEnd={()=>console.log("onTouchEnd")}
      // 松手后减速开始的回调
      // onMomentumScrollBegin={() => {
      // }}
      // 减速结束回调
      onMomentumScrollEnd={() => {
      }}
      // 监听列表滑动（JavaScript端）
      // onScroll={({nativeEvent:{contentOffset:{x,y}}})=>console.log("onScroll:",x,y)}
      //     使用原生动画值监听滑动偏移，可以用作插值动画
      //     onNativeContentOffsetExtract={{ x?: Animated.Value, y?: Animated.Value }}
      // 将TextInput的引用传入，让SpringScrollView自动管理键盘遮挡问题。
      textInputRefs={[]}
      // 滑动屏幕时是否隐藏键盘
      dragToHideKeyboard={true}
      // 不同的系统，不同的三方输入法，键盘的工具栏高度是不确定的，并且官方没有给出获取工具栏高度的办法，这个属性用以给用户小幅调整键盘弹起时，组件偏移的位置
      inputToolBarHeight={44}
      // 优化参数，LargeList将各行进行分组（不是Section，这个视独立的组），groupCount表示总共渲染4组，每组至少渲染groupMinHeight高度，值越大预渲染的行数越多，对应的初始化越慢。请注意groupCount * groupMinHeight必须大于LargeList的视口高度。
      groupCount={4}
      // 更新延时，值越小请求更新的频率越高，但是React Native是异步的，请求更新过多会导致更新不过来；值越大越容易让用户看到新的Item替换旧的Item的现象。
      updateTimeInterval={150}
    />
  )
}
// List.propTypes = {
//   onRefresh: PropTypes.func,
//   onLoading: PropTypes.func,
//   heightForSection: PropTypes.func,
//   renderSection: PropTypes.func,
//   heightForIndexPath: PropTypes.func.isRequired,
//   renderIndexPath: PropTypes.func.isRequired
// }
// List.defaultProps = {
// }

// @ts-ignore
const styles = MyStyleSheet.create({
  container: {
    flex: 1, width: '100%'
  },
  header: {
    alignSelf: 'center',
    marginVertical: 50
  },
  section: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },

  sectionText: {
    fontSize: 20,
    marginLeft: 10
  },
  rContainer: { marginLeft: 20 }

})

// @ts-ignore
export default memo(forwardRef(List))
