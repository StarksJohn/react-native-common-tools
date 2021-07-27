import React, { Component, } from 'react'
import {
  StyleSheet,
  Text, SectionList,
  View, Platform,
  TouchableOpacity,
  ActivityIndicator, RefreshControl, Image
} from 'react-native'   //引入js文件
import PropTypes from 'prop-types'
import ViewPropTypes from './ViewPropTypes'
import * as _ from 'lodash'
import PureComponent from './PureComponent'
import constant from '../constant/constant'
import tool from '../tools/tool'

const _refreshControlStyle = {
  // backgroundColor: '#F5F5F5',
  tintColor: '#666666',
  titleColor: '#666666',
  progressBackgroundColor: '#F5F5F5',
  title: '领券更优惠 ~'
}

export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3,//没有更多
  FooterFailure: 4,//加载更多失败，不是 没数据，而是 接口没通，可能是 网络等其他原因
  EmptyData: 5,//完全无数据
}

export default class BaseSectionList extends PureComponent {
  // 定义props类型
  static propTypes = {
    renderListHeaderComponent: PropTypes.func,
    name: PropTypes.string,/*组件名字*/
    refreshControlStyle: PropTypes.object,
    style: ViewPropTypes.style,
    renderSectionHeader: PropTypes.func,
    showLoadMoreComp: PropTypes.bool,
    sections: PropTypes.array,
    renderItem: PropTypes.func,
    needRefresh: PropTypes.bool,
    refresh: PropTypes.func,
    loadMore: PropTypes.func,
    pageSize: PropTypes.number,
    loadedAll: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    footerRefreshingText: PropTypes.string,
    footerFailureText: PropTypes.string,
    footerNoMoreDataText: PropTypes.string,
    footerEmptyDataText: PropTypes.string,
    footerRefreshingComponent: PropTypes.element,
    footerFailureComponent: PropTypes.element,
    footerNoMoreDataComponent: PropTypes.element,
    footerEmptyDataComponent: PropTypes.element,
    showScrollToTop: PropTypes.bool,/*右下角是否显示 向上箭头，点击后 列表直接 滚动到  顶部*/
    renderEmptyList: PropTypes.func,
    keyExtractor: PropTypes.func,
    initialNumToRender: PropTypes.number,
    getItemLayout: PropTypes.func,
    viewOffset: PropTypes.number,
    registTabBarOnTwiceClickEvent: PropTypes.bool,//是否注册 底部tabbar  双击 事件
    hasAdsCell: PropTypes.bool,//列表第二页开始是否每页都有个 广告cell
  }

  static defaultProps = {
    needRefresh: true,//是否需 要下拉刷新功能
    renderListHeaderComponent: (listHeaderData) => {
      return null
    },
    style: {},
    renderSectionHeader: (info) => {
      return null
    },
    sections: [
      // {
      //   key: 'A',//key 不是 必须字段,用于 renderSectionHeader 的数据源
      //   data: [{ title: '啊是啊' }]  //data 是必填字段不能改名，数组元素对应列表每个item
      // }
    ],
    renderItem: (info) => {
    },
    refresh: () => {
    },
    loadMore: () => {
    },
    pageSize: constant.listPageSize,
    loadedAll: false,
    showLoadMoreComp: true,
    scrollEnabled: true,
    refreshControlStyle: _refreshControlStyle,
    footerRefreshingText: '数据加载中…',
    footerFailureText: '点击重新加载',
    footerNoMoreDataText: '———— 我是有底线的 ————',
    footerEmptyDataText: '暂时没有相关数据',
    showScrollToTop: true,
    renderEmptyList: null,
    keyExtractor: (item, index) => {
      return index  //外部要 重写此方法，返回 每个item的 唯一标示，才能优化 列表性能
    },
    initialNumToRender: constant.listPageSize,
    getItemLayout: () => {
      return null
    }, viewOffset: 0, registTabBarOnTwiceClickEvent: false, hasAdsCell: false,
  }

  constructor (props) { //构造器
    super(props)
    this.state = {
      loadedAll: false,
      listHeight: 0,//为了 ListEmptyComponent
      page: 1,
      sections: props.sections,
      listState: RefreshState.Idle,
      listHeaderData: null,
      registTabBarOnTwiceClickEvent: props.registTabBarOnTwiceClickEvent
    }
    this.loadMoreDataThrottled = _.throttle(this.loadMore, 500)//真机安卓测试后没发现 自动回调2次  onEndReached 的现象，模拟器经常出现
    this.showScrollTopBt = false
    this.onFocusTimeStamp = 0//获取焦点的时间戳
    this.onBlurTimeStamp = 0//取消焦点的时间戳

    this.renderSectionListHeader = this.renderSectionListHeader.bind(this)
    this._renderItem = this._renderItem.bind(this)
  }

  /**
   * 当前列表 监听|取消监听 双击tabbar 事件
   * @param b
   */
  // changeRegistTabBarOnTwiceClickEvent (b) {
  //   this.state.registTabBarOnTwiceClickEvent !== b && this.setState({
  //     registTabBarOnTwiceClickEvent: b
  //   }, () => {
  //     if (!this.state.registTabBarOnTwiceClickEvent) {
  //       this.onBlurTimeStamp = dateTools.curTimeStamp()
  //       console.log(this.props.name, '列表在取消焦点时的 时间戳=', this.onBlurTimeStamp)
  //       this.tabBarOnTwiceClickListener.removeEventListener()
  //       this.tabBarOnTwiceClickListener = null
  //     } else {
  //       this.creatTabBarOnTwiceClickListener()
  //     }
  //   })
  // }

  /**
   * 当前列表获取焦点
   */
  creatTabBarOnTwiceClickListener () {
    // this.onFocusTimeStamp = dateTools.curTimeStamp()
    // this.onBlurTimeStamp = 0
    // console.log(this.props.name, '列表在获取焦点时的 时间戳=', this.onFocusTimeStamp)
    // this.tabBarOnTwiceClickListener = new EventListener({
    //   eventName: gConstant.event.tabBarOnTwiceClick,
    //   eventCallback: ({ context }) => {
    //     console.log(this.props.name, '列表 收到 tabbar双击事件，context=', context)
    //     this.SectionListR.scrollToLocation({ /*viewPosition: 1  viewOffset: 0*/
    //       sectionIndex: 0,
    //       itemIndex: 0, viewOffset: this.props.viewOffset,//viewPosition:0,
    //     })
    //     this.scrollTopBtR.setState({ show: false })
    //   }
    // })
    // if (this.state.page === 1 && this.state.sections.length === 0) {//第一页时 获取焦点
    //   this.preRefresh()
    // }
  }

  componentDidMount () {
    // console.log('BaseSectionList.js componentDidMount')

    console.log('SectionList.js componentDidMount')
    this.refresh()
  }

  shouldComponentUpdate (nextProps, nextState) {
    // console.log(this.props.name, 'shouldComponentUpdate=', super.shouldComponentUpdate(nextProps, nextState))
    return super.shouldComponentUpdate(nextProps, nextState)
  }

  // componentWillReceiveProps (nextProps) {
  //   // console.log(this.props.name, 'componentWillReceiveProps nextProps==', nextProps)
  //
  //   if (nextProps.hasOwnProperty('state')) {
  //     // console.log(this.props.name, 'componentWillReceiveProps nextProps.state==', nextProps.state)
  //
  //     // 根据父组件传递的 state 改变自己的state
  //     this.setState(nextProps.state)
  //   }
  // }

  scrollEnabled (b) {
    this.SectionListR.setNativeProps({ scrollEnabled: b })

  }

  shouldStartHeaderRefreshing () {
    console.log('SectionList.js shouldStartHeaderRefreshing this.state.listState=', this.state.listState)
    if (this.state.listState === RefreshState.HeaderRefreshing ||
      this.state.listState === RefreshState.FooterRefreshing) {
      return false
    }
    return true
  }

  changeListState (res) {
    let listState = RefreshState.Idle
    if (res.sections.length === 0) {
      listState = RefreshState.EmptyData
    } else if (res.sections.length > 0 && res.loadedAll) {
      listState = RefreshState.NoMoreData
    }
    return listState
  }

  /**
   *先 进刷新状态，过1秒后如果没 失去焦点，再真正请求数据
   */
  // preRefresh () {
  //   if (!this.props.needRefresh) {
  //     console.log(this.props.name, ' 的 needRefresh ')
  //     return
  //   }
  //
  //   if (this.shouldStartHeaderRefreshing()) {
  //     this.setState({
  //       page: 1, listState: RefreshState.HeaderRefreshing,
  //     }, () => {
  //       setTimeout(() => {
  //         if (this.onBlurTimeStamp === 0 && this.state.listState === RefreshState.HeaderRefreshing) {//获取焦点一秒后没失去焦点，开始请求数据
  //           this.setState({
  //             listState: RefreshState.Idle,
  //           }, () => {
  //             this.refresh()
  //           })
  //         } else {//1秒后 当前列表 已经失去了焦点，不请求数据
  //           this.setState({
  //             listState: RefreshState.Idle,
  //           }, () => {
  //           })
  //         }
  //       }, 1000)
  //     })
  //   }
  // }

  /*刷新*/
  refresh () {
    if (!this.props.needRefresh) {
      console.log('SectionList.js ', this.props.name, ' 的 needRefresh ')
      return
    }

    if (this.shouldStartHeaderRefreshing()) {
      console.log('\n SectionList 准备获取', this.props.name, ' 列表的 第 ', 1, '页数据')

      if (Platform.OS === 'ios') {
        this.SectionListR && this.SectionListR.setNativeProps({ contentOffset: { x: 0, y: 0 } })//安卓没效果
      } else {
        //ios 也没效果
        this.state.sections.length > 0 && this.SectionListR && this.SectionListR.scrollToLocation({ /*viewPosition: 1  viewOffset: 0*/
          sectionIndex: 0,
          itemIndex: 0, viewOffset: this.props.viewOffset,//viewPosition:0,
        })
      }

      this.showScrollTopBt = false
      this.scrollTopBtR && this.scrollTopBtR.setState({ show: this.showScrollTopBt })

      this.setState({
          page: 1, listState: RefreshState.HeaderRefreshing,
        }, async () => {
          console.log('SectionList.js goto this.props.refresh()')
          const [err, data] = await tool.to(this.props.refresh({ sections: []/*传给具体接口，用于刷新成功后改变其指针,让 数据源重置*/ }))
          if (data && data.sections.length > 0) {
            console.log('SectionList 获取 ', this.props.name, ' 列表的 第', this.state.page, '页数据 成功，准备刷新ui，data=', data)
            this.setState({
              sections: data.sections,
              loadedAll: data.loadedAll,
              listState: this.changeListState(data),
              listHeaderData: data.listHeaderData
            }, () => {
            })
          } else {
            this.setState({
              sections: [], listState: RefreshState.EmptyData, loadedAll: false
            }, () => {
            })
          }
        }
      )
    }
  }

  /**
   * 加载更多
   * */
  loadMore = () => {
    console.log('SectionList 调用 loadMore 函数')
    if (this.shouldStartFooterRefreshing()) {
      this.setState(
        {
          listState: RefreshState.FooterRefreshing, page: this.state.page + 1
        }, async () => {
          console.log('\n SectionList 准备获取', this.props.name, ' 列表的 第 ', this.state.page, '页数据,state=', this.state)
          const [err, data] = await tool.to(this.props.loadMore({ page: this.state.page, sections: this.state.sections }))
          if (data && data.sections.length > 0) {
            console.log('SectionList 获取 ', this.props.name, ' 列表的 第', this.state.page, '页数据 成功，准备刷新ui，data=', data)
            this.setState({
              sections: data.sections,
              loadedAll: data.loadedAll,
              listState: this.changeListState(data)
            }, () => {
            })
          } else {
            console.log('SectionList 获取 ', this.props.name, ' 列表的 第', this.state.page, '页数据 失败')
            this.setState({
              loadedAll: false, page: this.state.page - 1,
              listState: RefreshState.FooterFailure
            }, () => {
            })
          }
        }
      )

    }
  }

  shouldStartFooterRefreshing = () => {
    // if (this.state.listState !== RefreshState.Idle) {
    //   console.log('不能加载更多，因 this.state.listState =', this.state.listState)
    // }
    return ((this.state.listState === RefreshState.Idle || this.state.listState === RefreshState.FooterFailure) && !this.state.loadedAll)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log('SectionList.js ', this.props.name, ' 列表 已重绘，this.state= ', this.state)
  }

  renderSectionListHeader () {
    const { listHeaderData } = this.state
    const { renderListHeaderComponent } = this.props
    return (listHeaderData && renderListHeaderComponent(listHeaderData)) || null
  }

  renderFooter = () => {
    let footer = null

    let {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText,
      footerRefreshingComponent,
      footerFailureComponent,
      footerNoMoreDataComponent,
      footerEmptyDataComponent,
    } = this.props

    // console.log('准备画 renderFooter，state=', this.state)

    switch (this.state.listState) {
      case RefreshState.Idle:
        footer = (<View style={styles.footerContainer} />)
        break
      case RefreshState.FooterFailure: {
        footer = (
          <TouchableOpacity onPress={() => {
            // if (this.props.data.length === 0) {
            //   this.props.refresh && this.props.refresh(RefreshState.HeaderRefreshing)
            // } else
            {
              this.loadMore()
            }
          }}
          >
            {footerFailureComponent ? footerFailureComponent : (
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{footerFailureText}</Text>
              </View>
            )}
          </TouchableOpacity>
        )
        break
      }
      case RefreshState.EmptyData: {
        footer = (
          <TouchableOpacity onPress={() => {
            this.props.refresh && this.props.refresh(RefreshState.HeaderRefreshing)
          }}
          >
            {footerEmptyDataComponent ? footerEmptyDataComponent : (
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{footerEmptyDataText}</Text>
              </View>
            )}
          </TouchableOpacity>
        )
        break
      }
      case RefreshState.FooterRefreshing: {
        footer = footerRefreshingComponent ? footerRefreshingComponent : (
          <View style={styles.footerContainer}>
            <ActivityIndicator size="small" color="#888888" />
            <Text style={[styles.footerText, { marginLeft: 7 }]}>{footerRefreshingText}</Text>
          </View>
        )
        break
      }
      case RefreshState.NoMoreData: {
        footer = footerNoMoreDataComponent ? footerNoMoreDataComponent : (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>{footerNoMoreDataText}</Text>
          </View>
        )
        break
      }
    }

    return footer
  }

  _renderItem (info) {
    // console.log(this.props.name, '列表_renderItem,info=', info)
    // console.log('HalfScreenWInfoFliowAdsCell', 'BaseSectionList', info)
    return this.props.renderItem(info)
  }

  _sectionComp = (info) => {
    return this.props.renderSectionHeader(info)
  }

  // renderScrollTopBt () {
  //   return <BasePureComponent
  //     name={'renderScrollTopBt'}
  //     ref={
  //       (r) => {
  //         this.scrollTopBtR = r
  //       }
  //     }
  //     state={
  //       {
  //         show: this.showScrollTopBt
  //       }
  //     }
  //     render={
  //       (self) => {
  //         return self.state.show && this.props.showScrollToTop && (
  //           <TouchableOpacity
  //             styles={{
  //               backgroundColor: 'transparent',
  //               position: 'absolute',
  //               right: gScaleSize(20), zIndex: 2,
  //               bottom: 40,
  //             }}
  //             onPress={() => {
  //               //https://www.jianshu.com/p/38528930b3d1
  //               this.SectionListR.scrollToLocation({ /*viewPosition: 1  viewOffset: 0*/
  //                 sectionIndex: 0,
  //                 itemIndex: 0, viewOffset: this.props.viewOffset,//viewPosition:0,
  //               })
  //
  //               self.setState({ show: false })
  //             }}>
  //             <Image source={imgSource.icon_zhiding} styles={{ width: gScaleSize(48), height: gScaleSize(48) }} />
  //           </TouchableOpacity>
  //         )
  //
  //       }
  //     }
  //   />
  // }

  _renderEmpty () {
    return (!this.props.hasOwnProperty('renderHeader')) && this.state.listState === RefreshState.Idle && this.props.renderEmptyList ?
      <View style={{
        flex: 1,// backgroundColor: gRandomColor(),
        height: this.state.listHeight
      }}>
        {this.props.renderEmptyList(this.refresh)}
      </View> : <View />
  }

  componentWillUnmount () {
    this.loadMoreDataThrottled.cancel()
  }

  render () {
    const { renderListHeaderComponent, style, showLoadMoreComp, loadedAll, refreshControlStyle, name, keyExtractor, initialNumToRender, getItemLayout } = this.props
    const { listHeight, sections, listState, listHeaderData } = this.state

    console.log('SectionList ', name, ' 列表 开始 render，state=', this.state)
    console.log('SectionList render listHeaderData', listHeaderData)

    const _rest = {}
    if (!getItemLayout) {//没传 getItemLayout 但传了 cellHeight
      _rest.getItemLayout = getItemLayout//https://www.jianshu.com/p/38528930b3d1
    }
    return (
      <SectionList
        ref={
          (r) => {
            this.SectionListR = r
          }
        }
        onLayout={(e) => {
          if (listHeight === 0 && e.nativeEvent.layout.height !== 0) {
            console.log('SectionList 设置 ' + name + ' 列表的 listHeight，马上重绘，e.nativeEvent.layout.height=', e.nativeEvent.layout.height)
            this.setState({//为了显示 ListEmptyComponent
              listHeight: e.nativeEvent.layout.height
            })
          }
        }}
        style={style}
        refreshControl={
          <RefreshControl
            backgroundColor={refreshControlStyle.backgroundColor}
            tintColor={refreshControlStyle.tintColor}
            title={refreshControlStyle.title}
            titleColor={refreshControlStyle.titleColor}
            colors={['#24292e', '#42464b']}
            progressBackgroundColor={refreshControlStyle.progressBackgroundColor}
            refreshing={listState === RefreshState.HeaderRefreshing}
            onRefresh={() => {
              console.log('SectionList.js onRefresh')
              this.refresh()
            }}>
          </RefreshControl>
        }
        renderSectionHeader={this._sectionComp} //区头
        renderItem={this._renderItem}   //cell
        sections={sections}     //数据源
        // ItemSeparatorComponent={() => <View styles={{ backgroundColor: 'red', height: 1 }}></View>}  //分割线
        stickySectionHeadersEnabled={true}  //设置区头是否悬浮在屏幕顶部,默认是true
        initialNumToRender={initialNumToRender} //指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容
        onEndReachedThreshold={0.5}  //0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
        onEndReached={this.loadMoreDataThrottled}  //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
        setVerticalScrollBarEnabled={false}
        setFastScrollEnabled={false}
        refreshing={listState === RefreshState.HeaderRefreshing} // 是否刷新 ，自带刷新控件
        ListHeaderComponent={this.renderSectionListHeader}
        ListFooterComponent={() => {
          return showLoadMoreComp && this.renderFooter()
        }}
        keyExtractor={(item, index) => {
          return keyExtractor(item, index)
        }}
        ListEmptyComponent={this._renderEmpty()}
        removeClippedSubviews={false} //true时，导致 安卓 debug 报错:index=6 count=0
        onMomentumScrollEnd={
          (e) => {
            // console.log(name, '列表 onMomentumScrollEnd e.nativeEvent=', e.nativeEvent)
            // this.showScrollTopBt = e.nativeEvent.contentOffset.y > 10 //10是 因为ios 点击 回滚按钮&& 回滚后，onMomentumScrollEnd 回调，contentOffset.y=2
            // this.scrollTopBtR.setState({ show: this.showScrollTopBt })
          }
        }
        {..._rest}
      />
    )
  }
}

// 创建样式表
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5'
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 44,// backgroundColor: gRandomColor()
  },
  footerText: {
    fontSize: 14,
    color: '#555555'
  }
})
