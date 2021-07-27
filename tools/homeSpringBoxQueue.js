/**
 * 首页弹框方法调用队列
 */
import EventListener from './EventListener'
import constant from '../constant/constant'

//构造函数
const homeSpringBoxQueue = function () {
  console.log('homeSpringBoxQueue construct ',)
  this.homePageBombQueue = []/*执行的任务队列*/
  //执行某个任务的事件
  this.executeListener = new EventListener({
    eventName: constant.event.executeHomeSpringBoxQueueEvent,
    eventCallback: ({ taskID }) => {
      const task = this.homePageBombQueue.sf_findObjWithPredicate((item) => {
        return item.taskID === taskID
      })
      if (task) {
        task.func((b) => {
          if (b) {// 当前任务执行完毕,删除任务，继续执行
            this.homePageBombQueue.splice(0, 1)
            this.executQueue()
          }
        })
      }
    }
  })
  this.init()
}

homeSpringBoxQueue.prototype.init = async function () {
  console.log('homeSpringBoxQueue init ',)

  /**
   * 添加任务进队列
   */
  this.addFuncTuQueue = ({ func }) => {
    this.homePageBombQueue.push({ taskID: this.homePageBombQueue.length, func, })
  }

  /**
   * 执行队列任务
   */
  this.executQueue = () => {
    this.homePageBombQueue.length > 0 && gSendEvent(constant.event.executeHomeSpringBoxQueueEvent, { taskID: this.homePageBombQueue[0].taskID })
  }
}

const singleton = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new homeSpringBoxQueue()
    }
    return instance
  }
})

export default new singleton()()
