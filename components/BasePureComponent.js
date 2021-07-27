/**
 * BasePureComponent.js
 * 实现 此控件 render的 方法,不会因 其父组件重绘 被 重绘调用,所有 未写成 class的控件如果不想被 重绘, 都可放到此控件里 render
 * http://www.jianshu.com/p/57f2e987c879
 */
import EventListener from '../tools/EventListener'
import PropTypes from 'prop-types'
import *as stringUtils from '../tools/stringTools'
import PureComponent from './PureComponent'

export default class BasePureComponent extends PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
    shouldComponentUpdate: PropTypes.func,
    // setState: PropTypes.func, // 初始化state
    state: PropTypes.object, // state 由 事件 改变，
    name: PropTypes.string,
    changeStateEventName: PropTypes.string,// 不同的value 标记不同 的 BasePureComponent 控件监听 不同的
    // ChangeStateEvent事件,外部发 事件 改变 事件 监听者 的 state
    initData: PropTypes.func, //componentDidMount 生命周期 异步获取 服务端 初始数据事件
    componentWillUnmount: PropTypes.func, componentDidUpdate: PropTypes.func,
  }

  static defaultProps = {
    render: () => {

    },
    initData: () => {

    },
    // setState: () => {
    //
    // },
    changeStateEventName:
      ''
    ,
    state: {}
  }

  constructor (props) {
    super(props)
    // console.log('BasePureComponent constructor props=', props)
    this.state = props.state

    this.props.initData && this.props.initData(this)

  }

  componentDidMount () {
    const { changeStateEventName } = this.props

    let self = this

    // this.props.setState && this.props.setState(this)

    if (!stringUtils.isNull(changeStateEventName)) {
      this.changeStateEvent = new EventListener({
        eventName: changeStateEventName,
        eventCallback: (newState) => {
          self.setState(newState)
        }
      })
    }
  }

  /**
   * https://www.cnblogs.com/mengff/p/12574405.html
   * 在组件接受新的props之后触发，更新状态是异步的，也是componentWillReceiveProps生命周期被废弃的重要原因(可能导致某些问题), 所以推荐使用 componentDidUpdate
   * 收到新的props或新的state之后做一些事情;props和state变化都会触发，所有在此更新状态一定要有判断条件
   * 更新状态是异步的, 触发重新render
   * @param nextProps
   * @param nextState
   * @returns {boolean|*}
   */
  componentDidUpdate (prevProps, prevState) {
    if (this.props.componentDidUpdate) {
      return this.props.componentDidUpdate(prevProps, prevState, this)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.shouldComponentUpdate) {
      return this.props.shouldComponentUpdate(nextProps, nextState, this.state, this.props, this)
    } else {
      let shouldComponentUpdate = super.shouldComponentUpdate(nextProps, nextState)
      // console.log(this.props.name, '  shouldComponentUpdate:', shouldComponentUpdate)
      return shouldComponentUpdate
      // return super.shouldComponentUpdate(nextProps, nextState)
    }
  }

  componentWillUnmount () {
    this.props.componentWillUnmount && this.props.componentWillUnmount(this)
    if (this.changeStateEvent) {
      this.changeStateEvent.removeEventListener()
    }
  }

  render () {
    const { render } = this.props
    // console.log(this.props.name, '即将重绘')

    return (
      render(this)
    )
  }
}
