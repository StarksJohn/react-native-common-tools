import { Component } from 'react'

export default class PureComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
  }

  /**
   * 因  React.PureComponent 的 自身 shouldComponentUpdate 方法是 浅比较，涉及数据嵌套层级过多时，比如说你 props 传入了一个两层嵌套的 Object，这时候
   * shouldComponentUpdate 就很为难了，故 重写此方法，深层比较 props和 state
   * 为了让此方法能正确比较前后2个 state 对象里的 某个对象的差异，在 setState 前，要 先把 state.xxx 深拷贝
   *   let _data = { ...this.state.data }
   _data.count += 1
   this.setState({ data: _data }) 这样 shouldComponentUpdate 方法 才能返回 true
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate (nextProps, nextState) {
    return this._shouldUpdate(this.props, nextProps, this.updatePropsKeys()) ||
      this._shouldUpdate(this.state, nextState, this.updateStateKeys())
  }

  //https://www.cnblogs.com/mengff/p/12574405.html
  componentDidUpdate (prevProps, prevState, spanshot) { }

  /**
   * 需要检查更新的keys (props)
   * @returns {Array}
   */
  updatePropsKeys () {
    if (this.props) {
      return Object.keys(this.props)
    }
    return []
  }

  /**
   * 需要检查更新的keys (state)
   * @returns {Array}
   */
  updateStateKeys () {
    if (this.state) {
      return Object.keys(this.state)
    }
    return []
  }

  _shouldUpdate = (old, now, keys) => {
    if (!this._isEmpty(keys)) {
      for (const i in keys) {
        const key = keys[i]
        const oldValue = old[key]
        const nowValue = now[key]
        if (typeof (oldValue) !== 'function' && typeof (nowValue) !== 'function') {
          try {
            if (JSON.stringify(oldValue) !== JSON.stringify(nowValue)) {
              return true
            }
          } catch (e) {

          }
        }
      }
    }
    return false
  }

  _isEmpty = (object) => {
    if (object === null) {
      return true
    } else {
      switch (typeof object) {
        case 'undefined': {
          return true
        }
        case 'string': {
          return object === ''
        }
        case 'object': {
          for (const key in object) {
            return false
          }
          return true
        }
        default: {
          return false
        }
      }
    }
  }

  componentWillUnmount () {
  }
}
