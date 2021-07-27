import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ViewPropTypes from "./ViewPropTypes";
import Text from "./Text/Text";
import * as _ from "lodash";
import constant from "../constant/constant";
import tool from "../tools/tool";
import appStyle from "../styles/appStyle";

const { dp } = appStyle;

const _refreshControlStyle = {
  // backgroundColor: '#F5F5F5',
  tintColor: "#666666",
  titleColor: "#666666",
  progressBackgroundColor: "#F5F5F5",
  title: "Refreshing...",
};

export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3, // 没有更多
  Failure: 4,
  EmptyData: 5, // 完全无数据
};

/**
 * 通用层的 列表，借鉴 https://github.com/huanxsd/react-native-refresh-list-view
 * 坑：快速滑动时 出现 白屏情况，解决方法
 *  1： 当cell 是固定高 && 每个cell 之间看上去像是 有间隔时 不要给cell 设置 marginBottom, 再把 cellHeight 设置成 cellH+marginBottom；而是 cellH 要设置成 看上去的 高度加 上下 marginBottom/2
 *  ，如 HomeListCell，这样 快速 滑动 就不会 出现 白屏 或者 错乱的情况
 *  2： 不等高的cell 暂时不用 getItemLayout，否则会出现 闪屏
 *
 */
export default class _FlatList extends PureComponent {
  // eslint-disable-next-line no-undef
  static propTypes = {
    name: PropTypes.string,
    pagingEnabled: PropTypes.bool,
    renderScrollTopBt: PropTypes.bool /* 是否画可点击后 滚回顶部的按钮 */,
    renderRow: PropTypes.func,
    renderFooter: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    refresh: PropTypes.func,
    onMomentumScrollEnd: PropTypes.func,
    loadMore: PropTypes.func,
    showReFreshControl: PropTypes.bool,
    getItemLayout:
      PropTypes.func /* 安卓必填可优化列表滑动,但ios 会造成 如首页 列表翻页时 cell 画不出来。妈的 */,
    componentDidUpdate: PropTypes.func,
    style: ViewPropTypes.style,
    renderEmptyList: PropTypes.func,
    refreshControlStyle: PropTypes.object,
    showScrollToTop:
      PropTypes.bool /* 右下角是否显示 向上箭头，点击后 列表直接 滚动到  顶部 */,
    onFooterRefresh: PropTypes.func,
    onRefreshed: PropTypes.func,
    // listRef: PropTypes.ref,
    footerRefreshingText: PropTypes.string,
    footerFailureText: PropTypes.string,
    footerNoMoreDataText: PropTypes.string,
    footerEmptyDataText: PropTypes.string,
    footerRefreshingComponent: PropTypes.element,
    footerFailureComponent: PropTypes.element,
    footerNoMoreDataComponent: PropTypes.element,
    footerEmptyDataComponent: PropTypes.element,
    ListHeaderComponent: PropTypes.element,
    pageSize: PropTypes.number,
    renderItem: PropTypes.func,
    cellHeight: PropTypes.number, // 如果需要给列表加 getItemLayout 属性 && 列表所有cell 等高，就 传 此数据,就会自动生成 getItemLayout 属性；如果 每个cell 之间 有 间隔，cellHeight 就是
    // 每个cell的高+间隔； 但是有个坑，就是 如果列表有 ListHeaderComponent ，此时 只设置 cellHeight 会导致 翻页时 卡顿，所以就不能 只通过 cellHeight 来 优化性能，只能在外部这么设置 getItemLayout={
    //         (data, index) => {
    //           return { length: cellH, offset: cellH * index + this.listHeaderH, index }
    //         }
    //       }
    initialNumToRender: PropTypes.number,
    keyExtractor: PropTypes.func,
    footerTextStyle: ViewPropTypes.style,
    listState: PropTypes.func,
    onScroll: PropTypes.func,
    onResetPressInEmptyList: PropTypes.func, // 列表无数据时  按下 点击重试 按钮时 的 回调
    registTabBarOnTwiceClickEvent: PropTypes.bool, // 注册 底部tabbar  双击 事件
    // hasAdsCell: PropTypes.bool,//列表第二页开始是否每页都有个 广告cell
    // addAdsCell: PropTypes.func,//从第二页开始，每页拿到数据后，在拿到的数据最底部 添加 一个 广告cell，
    page: PropTypes.number,
    showListEmptyComponent: PropTypes.bool /* 是否在列表没数据时 渲染组件 */,
  };

  // eslint-disable-next-line no-undef
  static defaultProps = {
    name: "",
    style: { backgroundColor: "#F5F5F5" },
    renderScrollTopBt: true,
    page: 0,
    renderRow: (item, index) => {
      return <View style={{ width: "100%", height: 100 }} />;
    },
    showReFreshControl: true,
    cellHeight: 0,
    refresh: (name) => {},
    loadMore: (page, name) => {},
    renderFooter: true,
    showsVerticalScrollIndicator: false,
    refreshControlStyle: _refreshControlStyle,
    showListEmptyComponent: true,
    showScrollToTop: true,
    onResetPressInEmptyList: null,
    renderEmptyList: null,
    footerRefreshingText: "Loading…",
    footerFailureText: "Click to reload",
    footerNoMoreDataText: "No more data~",
    footerEmptyDataText: "No relevant data",
    initialNumToRender: constant.listPageSize / 2,
    pageSize: constant.listPageSize,
    registTabBarOnTwiceClickEvent: false,
    keyExtractor: (item, index) => {
      return index; // 外部要 重写此方法，返回 每个item的 唯一标示，才能优化 列表性能
    },
    listState: (data, state, pageSize) => {
      let listState = RefreshState.Idle;
      if (data.length === 0) {
        if (state.page === 1) {
          listState = RefreshState.EmptyData;
        } else {
          listState = RefreshState.NoMoreData;
        }
      } else if (data.length > 0 && data.length < pageSize) {
        listState = RefreshState.NoMoreData;
      }
      console.log("FlatList listState=", listState);
      return listState;
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [{ id: -111 }], // 数据源,没有数据源，一开始就不显示 下拉菊花，故一开始先留一个空item
      listState: RefreshState.Idle,
      scrollEnabled: true,
      listHeight: 0, // 为了 ListEmptyComponent
      page: this.props.page,
      registTabBarOnTwiceClickEvent: this.props.registTabBarOnTwiceClickEvent,
    };
    // https://www.wandouip.com/t5i154703/ 解决 onEndReached总是会同时调用两次 问题，但模拟器貌似没效果，真机 不用此 封装也很少调2次
    this.loadMoreDataThrottled = _.throttle(this.onEndReached, 500);
    this.showScrollTopBt = false;
    this.adsIds = {}; // 当前列表生成过的 广告位的 id 集合，不能重复，否则 广告cell的 key 就会重复，导致渲染问题
    this.skuIds = {};
    this.viewOffset = 0;
  }

  // changeRegistTabBarOnTwiceClickEvent (b) {
  //   this.state.registTabBarOnTwiceClickEvent !== b && this.setState({
  //     registTabBarOnTwiceClickEvent: b
  //   }, () => {
  //     console.log('')
  //     if (!this.state.registTabBarOnTwiceClickEvent) {
  //       this.tabBarOnTwiceClickListener && this.tabBarOnTwiceClickListener.removeEventListener()
  //       this.tabBarOnTwiceClickListener = null
  //     } else {
  //       this.creatTabBarOnTwiceClickListener()
  //     }
  //   })
  // }

  // creatTabBarOnTwiceClickListener () {
  //   this.tabBarOnTwiceClickListener = new EventListener({
  //     eventName: gConstant.event.tabBarOnTwiceClick,
  //     eventCallback: ({ context }) => {
  //       console.log(this.props.name, '列表 收到 tabbar双击事件，context=', context)
  //       this.scrollToTop(true)
  //       this.scrollTopBtR.setState({ show: false })
  //     }
  //   })
  // }

  componentDidMount() {
    this.refresh();
    // if (this.state.registTabBarOnTwiceClickEvent) {
    //   this.creatTabBarOnTwiceClickListener()
    // }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('[RefreshListView]  RefreshListView componentWillReceiveProps nextProps= ' + nextProps)
  }

  setScrollEnabled(b) {
    this.setState({ scrollEnabled: b });
  }

  // eslint-disable-next-line no-undef
  refresh = () => {
    const { refresh, name, onRefreshed, page } = this.props;

    if (this.shouldStartHeaderRefreshing()) {
      if (!this.props.hasOwnProperty("refresh")) {
        console.log("FlatList 的 refresh 属性没有");
        return;
      }
      console.log(
        "\nFlatList 准备获取",
        this.props.name,
        " 列表的 第 1 页数据"
      );

      // if (this.state.data.length > 0) {
      //   if (gisIos) {
      //     this.listRef && this.listRef.setNativeProps({ contentOffset: { x: 0, y: 0 } })//安卓没效果
      //   } else if (this.state.data) {
      //     //ios 也没效果
      //     this.listRef && this.listRef.scrollToIndex({ viewPosition: 0, animated: true, index: 0 })//
      //   }
      // }

      // this.scrollToTop(false) 避免安卓手动下啦刷新后列表没有顶部对齐

      this.showScrollTopBt = false;
      // this.scrollTopBtR?.setState({ show: this.showScrollTopBt })

      this.setState(
        {
          listState: RefreshState.HeaderRefreshing,
          page: 1,
          data: [],
        },
        async () => {
          const [err, data] = await tool.to(refresh(this));
          if (data) {
            if (data && data.length > 0) {
              console.log(
                "FlatList 获取 ",
                name,
                " 列表的 第",
                this.state.page,
                "页数据 成功，准备刷新ui，data=",
                data
              );
              this.setState(
                {
                  data: data,
                  listState: this.changeListState(data),
                  page: this.state.page,
                  scrollEnabled: true,
                },
                () => {
                  console.log("FlatList.js 列表刷新 状态完毕");
                  onRefreshed && onRefreshed(this);
                }
              );
            } else {
              this.setState(
                {
                  data: [],
                  listState: this.changeListState([]),
                  page: 1,
                  scrollEnabled: false,
                },
                () => {}
              );
            }
          } else {
            console.log(
              "FlatList 获取 ",
              name,
              " 列表的 第",
              this.state.page,
              "页数据 失败"
            );
            this.setState(
              {
                data: [],
                listState: this.changeListState([]),
                page: 1,
                scrollEnabled: false,
              },
              () => {}
            );
          }
        }
      );
    }
  };

  changeListState(data) {
    return this.props.listState(data, this.state, this.props.pageSize);
  }

  getDataSource() {
    return this.state.data;
  }

  /**
   * 从第二页开始，每页拿到数据后，在拿到的数据最底部 添加 一个 广告cell，
   * @param data
   */
  // addAdsCell (data) {
  //   let arr = data //[...data]
  //   const self = this
  //   if (this.props.hasAdsCell) {
  //     if (this.props.addAdsCell) {
  //       return this.props.addAdsCell(data)
  //     }
  //     arr = [...data]
  //     // const _randomNums = () => {
  //     //   let id = randomNums(1, 10)
  //     //   console.log(self.props.name + '列表随机出 id= ' + id + ' 的广告位')
  //     //
  //     //   if (!self.adsIds[`${id}`]) {
  //     //     self.adsIds[`${id}`] = id
  //     //     return id
  //     //   } else {
  //     //     return _randomNums()
  //     //   }
  //     // }
  //     //
  //     // let id = _randomNums()
  //
  //     arr.push({
  //       cellType: gConstant.cellType.FullScreenWInfoFliowAdsCell
  //     })
  //   }
  //
  //   return arr
  // }

  // eslint-disable-next-line no-undef
  onEndReached = (info) => {
    const { page } = this.state;
    if (this.shouldStartFooterRefreshing()) {
      // log('[RefreshListView]  onFooterRefresh')
      // this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
      this.setState(
        {
          listState: RefreshState.FooterRefreshing,
          page: page + 1,
        },
        () => {
          console.log(
            "\n FlatList 准备获取",
            this.props.name,
            " 列表的 第 ",
            this.state.page,
            "页数据"
          );
          this.props
            .loadMore(this.state.page, this)
            .then((data) => {
              if (data && data.length > 0) {
                console.log(
                  "FlatList 获取 ",
                  this.props.name,
                  " 列表的 第",
                  this.state.page,
                  "页数据 成功，准备刷新ui，data=",
                  data
                );
                this.setState(
                  {
                    data: this.state.data.concat(data),
                    listState: this.changeListState(data),
                  },
                  () => {
                    // this.page++
                  }
                );
              } else {
                this.setState(
                  {
                    listState: this.changeListState([]),
                    page: this.state.page - 1,
                  },
                  () => {}
                );
              }
            })
            .catch((e) => {
              console.log(
                "FlatList 获取 ",
                this.props.name,
                " 列表的 第",
                this.state.page,
                "页数据 失败",
                e
              );
              this.setState(
                {
                  listState: this.changeListState([]),
                  page: this.state.page - 1,
                },
                () => {}
              );
            });
        }
      );
    }
  };

  // eslint-disable-next-line no-undef
  shouldStartHeaderRefreshing = () => {
    if (
      this.state.listState === RefreshState.HeaderRefreshing ||
      this.state.listState === RefreshState.FooterRefreshing
    ) {
      return false;
    }

    return true;
  };

  scrollToTop(animated = false) {
    // this.listRef.scrollToIndex({ index: 0, animated: animated })
    if (this.state.data.length > 0) {
      if (Platform.OS === "ios") {
        this.listRef &&
          this.listRef.setNativeProps({ contentOffset: { x: 0, y: 0 } }); // 安卓没效果
      } else if (this.state.data) {
        // ios 也没效果
        this.listRef &&
          this.listRef.scrollToIndex({
            viewPosition: 0,
            animated: true,
            index: 0,
            viewOffset: this.viewOffset,
          }); //
      }
    }
  }

  /**
   * 滚动到 指定下标, index starts from 0
   * @param animated
   */
  scrollToIndex({
    animated = true,
    cellH,
    index = 0,
    viewPosition = 0,
    viewOffset = 0,
  }) {
    console.log("FlatList scrollToIndex index=", index, " cellH=", cellH);
    this.state.data.length > 0 &&
      this.listRef?.scrollToIndex({
        viewPosition: viewPosition,
        animated: animated,
        index: index,
        viewOffset: viewOffset,
      });
  }

  // eslint-disable-next-line no-undef
  shouldStartFooterRefreshing = () => {
    // log('[RefreshListView]  shouldStartFooterRefreshing')

    const { listState, data } = this.state;
    if (data.length === 0) {
      return false;
    }

    return listState === RefreshState.Idle;
  };

  // eslint-disable-next-line no-undef
  renderFooter = () => {
    let footer = null;

    const {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText,

      footerRefreshingComponent,
      footerFailureComponent,
      footerNoMoreDataComponent,
      footerEmptyDataComponent,
      footerTextStyle,
    } = this.props;

    switch (this.state.listState) {
      case RefreshState.Idle:
        footer = <View style={styles.footerContainer} />;
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity
            onPress={() => {
              if (this.props.data.length === 0) {
                this.props.refresh &&
                  this.props.refresh(RefreshState.HeaderRefreshing);
              } else {
                this.props.onFooterRefresh &&
                  this.props.onFooterRefresh(RefreshState.FooterRefreshing);
              }
            }}
          >
            {footerFailureComponent || (
              <View style={styles.footerContainer}>
                <Text style={[styles.footerText, footerTextStyle]}>
                  {footerFailureText}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.EmptyData: {
        // footer = (
        //   <TouchableOpacity onPress={() => {
        //     this.props.refresh && this.props.refresh(RefreshState.HeaderRefreshing)
        //   }}
        //   >
        //     {footerEmptyDataComponent ? footerEmptyDataComponent : (
        //       <View styles={styles.footerContainer}>
        //         <Text styles={styles.footerText}>{footerEmptyDataText}</Text>
        //       </View>
        //     )}
        //   </TouchableOpacity>
        // )
        break;
      }
      case RefreshState.FooterRefreshing: {
        footer = footerRefreshingComponent || (
          <View style={styles.footerContainer}>
            <ActivityIndicator size="small" color="#888888" />
            <Text style={[styles.footerText, { marginLeft: 7 }]}>
              {footerRefreshingText}
            </Text>
          </View>
        );
        break;
      }
      case RefreshState.NoMoreData: {
        footer = footerNoMoreDataComponent || (
          <View style={styles.footerContainer}>
            <Text style={[styles.footerText, footerTextStyle]}>
              {footerNoMoreDataText}
            </Text>
          </View>
        );
        break;
      }
    }

    return footer;
  };

  // eslint-disable-next-line no-undef
  onResetPressInEmptyList = () => {
    this.props.onResetPressInEmptyList(this);
  };

  _renderEmpty() {
    // console.log('FlatList.js _renderEmpty listState=', this.state.listState)
    return !this.props.hasOwnProperty("renderHeader") &&
      this.props.renderEmptyList &&
      (this.state.listState === RefreshState.Idle ||
        this.state.listState === RefreshState.EmptyData) ? (
      /* 避免在下拉刷新时显示 */ <View
        style={{
          flex: 1, // backgroundColor: appStyle.randomColor(),
          height: this.state.listHeight,
        }}
      >
        {this.props.renderEmptyList(
          !this.props.onResetPressInEmptyList
            ? this.refresh
            : this.onResetPressInEmptyList
        )}
      </View>
    ) : (
      <View />
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(
      "FlatList ",
      this.props.name,
      " 列表 已重绘,state= ",
      this.state
    );
    this.props.componentDidUpdate &&
      this.props.componentDidUpdate(prevProps, prevState, snapshot, this.state);
  }

  componentWillUnmount() {
    this.loadMoreDataThrottled.cancel();
    this.tabBarOnTwiceClickListener &&
      this.tabBarOnTwiceClickListener.removeEventListener();
    this.tabBarOnTwiceClickListener = null;
  }

  render() {
    const {
      name,
      renderRow,
      cellHeight,
      getItemLayout,
      style,
      refreshControlStyle,
      renderEmptyList,
      renderItem,
      initialNumToRender,
      keyExtractor,
      onScroll,
      ListHeaderComponent,
      pagingEnabled,
      renderScrollTopBt,
      renderFooter,
      showsVerticalScrollIndicator,
      onMomentumScrollEnd,
      showReFreshControl,
      showListEmptyComponent,
      ...rest
    } = this.props;
    const { listHeight, data, listState, scrollEnabled } = this.state;
    console.log("FlatList ", name, " 列表 开始重绘，state=", this.state);
    // console.log('getItemLayout', getItemLayout)
    const _rest = {};
    let _getItemLayout = getItemLayout;
    if (!_getItemLayout && cellHeight !== 0) {
      // 没传 getItemLayout 但传了 cellHeight
      _getItemLayout = (data, index) => {
        return { length: cellHeight, offset: cellHeight * index, index };
      };
      _rest.getItemLayout = _getItemLayout;
    }
    console.log("FlatList _rest=", _rest);

    return (
      <View style={[styles.container, style]}>
        <FlatList
          ref={(r) => {
            this.listRef = r;
          }}
          pagingEnabled={pagingEnabled}
          onLayout={(e) => {
            if (
              listHeight === 0 &&
              e.nativeEvent.layout.height !== 0 &&
              showListEmptyComponent
            ) {
              console.log(
                "FlatList 设置 " +
                  name +
                  " 列表的 listHeight，马上重绘,e.nativeEvent.layout.height=",
                e.nativeEvent.layout.height
              );
              this.setState({
                // 为了显示 ListEmptyComponent
                listHeight: e.nativeEvent.layout.height,
              });
            }
          }}
          onScroll={(event) => {
            onScroll && onScroll(event, this);
          }}
          refreshControl={
            showReFreshControl && (
              <RefreshControl
                backgroundColor={refreshControlStyle.backgroundColor}
                tintColor={refreshControlStyle.tintColor}
                title={refreshControlStyle.title}
                titleColor={refreshControlStyle.titleColor}
                colors={["#24292e", "#42464b"]}
                progressBackgroundColor={
                  refreshControlStyle.progressBackgroundColor
                }
                refreshing={listState === RefreshState.HeaderRefreshing}
                onRefresh={this.refresh}
              >
                {/* 子节点没效果 */}
                {/* <ImageBackground source={imgSource.} */}
                {/*                 styles={{ width: '100%', height: '100%' }}> */}
                {/* </ImageBackground> */}
              </RefreshControl>
            )
          }
          data={data}
          scrollEnabled={scrollEnabled}
          renderItem={({ item, index }) => {
            if (item.id === -111) {
              return (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    height: dp(appStyle.screenHeight),
                    // backgroundColor: gRandomColor()
                  }}
                />
              );
            } else {
              return renderRow(item, index);
            }
          }}
          keyExtractor={(item, index) => {
            return keyExtractor(item, index);
          }}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={renderFooter && this.renderFooter}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          onEndReached={this.loadMoreDataThrottled}
          ListEmptyComponent={this._renderEmpty()}
          enableEmptySections
          getItemLayout={_getItemLayout}
          onMomentumScrollEnd={(e) => {
            console.log(
              "FlatList ",
              name,
              "列表 onMomentumScrollEnd e.nativeEvent=",
              e.nativeEvent
            );
            if (renderScrollTopBt) {
              this.showScrollTopBt = e.nativeEvent.contentOffset.y > 10;
              // this.scrollTopBtR?.setState({ show: this.showScrollTopBt })
            }
            onMomentumScrollEnd && onMomentumScrollEnd(e);
          }}
          // 以下的性能优化参数 https://www.cnblogs.com/skychx/p/react-native-flatlist.html
          initialNumToRender={initialNumToRender}
          // 缺点：https://nostackdeveloper.com/how-to-improve-react-native-flatlist-performance/
          // 如果遇到频繁、高速的滚动，会导致大量的列表项组件初始化和卸载动作，虽然内存占用被减少，但随之而来的是计算量的大量增加，对于一些性能不够高的设备来说会出现明显的卡顿现象，影响用户体验。如果列表项组件内包含一些复杂的初始化操作和数据引用，可能会导致一些问题或内存泄漏。根据官方文档标注，开启此设定后在有些情况下会有 bug（比如内容无法显示），需谨慎使用。（尝试设定 removeClippedSubviews 为 true 后，测试一个 50 项列表的渲染，频繁滚动它，可以看到 CPU 占用有 5-10% 的上浮）
          removeClippedSubviews={/* Platform.OS === 'android' */ false} // 是否裁剪子视图，开不开，安卓列表快速滑动时 都会大白；true的时候目前会在ios上，首页tab切换时导致空白,故只在安卓上开启
          windowSize={constant.listPageSize}
          maxToRenderPerBatch={constant.listPageSize * 3} // 增量渲染最大数量
          updateCellsBatchingPeriod={50} // 增量渲染时间间隔
          // 限制 滚动速度,越小越慢
          decelerationRate={Platform.OS === "android" ? 0.95 : 1}
          // debug={__DEV__} // 开启 debug 模式
          // legacyImplementation={true}
          {...rest}
          {..._rest}
        />
        {/* {this.renderScrollTopBt()} */}
      </View>
    );
  }
}

// 创建样式表
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyle.pageBackgroundColor,
  },
  footerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 44,
  },
  footerText: {
    fontSize: 11,
    alignSelf: "center",
    color: "#999999",
  },
});
