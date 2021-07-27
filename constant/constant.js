/**
 * 通用项目需要的常量
 */
export default Object.freeze({
  listPageSize: 10, //列表每页请求数据数量
  event: {
    appStateChanged: "appStateChanged",
    executeHomeSpringBoxQueueEvent: "执行首页某个弹框任务的事件",
    appState: {
      inactive: "inactive",
      background: "background",
      active: "active",
      AudioPlayerPlaying: "音频播放器开始播放",
      AudioPlayerStop: "音频播放器停止",
    },
  },
  webView: {
    //在网页加载完成之后，还可以主动调用此方法,以 ref 形式调用）继续给 WebView 注入 JS 代码。注入后会立即执行。
    injectJavaScript: {
      bodyH: `var msg = {
                          bodyH: document.body.scrollHeight
                        }
      window.ReactNativeWebView.postMessage(JSON.stringify(msg))`, //获取h5的 body 的 高
    },
  },
});
