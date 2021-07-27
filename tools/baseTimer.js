/**
 * Created by Ebates on 2017/7/7.
 * 通用timer, 实现每隔 N秒 干一件事,直到 控件 Unmount 才取消
 * 可以被 ahooks 的 useInterval 代替
 */
export default class baseTimer {
  constructor (props) {
    this.props = props

    this.interval = null

    if (!props.timeInterval) {
      this.timeInterval = 1000//默认1000毫秒
    } else {
      this.timeInterval = props.timeInterval
    }

    this.interval = setInterval(
      () => {
        // Log.log('this.timerNum==  '+  this.timerNums )
        this.props.callBack && this.props.callBack() //每隔 timeInterval 秒 做的事情

      }, this.timeInterval
    )
  }

  clear () {
    if (this.interval) {
      clearInterval(this.interval)
      console.log('BaseTimer.js  clear()')

    }
  }
}
