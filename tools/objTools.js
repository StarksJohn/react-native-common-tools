import _ from 'lodash'

// 删除 obj对象里的 和 keys 数组 里 同名的 属性, 生成新的  对象
const omit = (obj, keys) => {
  return Object.keys(obj)
    .reduce((result, key) => {
      if (!keys.includes(key)) {
        result[key] = obj[key]
      }
      return result
    }, {})
}

/**
 * 深度合并2个对象的所有属性，obj2里比 obj1 里多的属性 不会 被合并到 新对象里，和 {...obj1,...obj2} 不一样，具体看 https://segmentfault.com/q/1010000008815500
 * @param obj1
 * @param obj2
 * @returns {*}
 * @constructor
 */
const DeepMergeNoExtraProps = (obj1, obj2) => {
  if (Object.prototype.toString.call(obj1) === '[object Object]' && Object.prototype.toString.call(obj2) === '[object Object]') {
    for (let prop2 in obj2) { // obj1无值,都有取obj2
      if (!obj1[prop2]) { // obj1 里没有 obj2.prop2 属性
        // obj1[prop2] = obj2[prop2];
      } else { // 递归赋值
        // obj1[prop2] = DeepMerge(obj1[prop2], obj2[prop2])
      }
    }
  } else if (Object.prototype.toString.call(obj1) === '[object Array]' && Object.prototype.toString.call(obj2) === '[object Array]') {
    // 两个都是数组，进行合并
    obj1 = obj1.concat(obj2)
  } else { // 其他情况，取obj2的值
    obj1 = obj2
  }
  return obj1
}

/**
 * 对象深拷贝 https://www.cnblogs.com/renbo/p/9563050.html
 * @param obj
 * @returns {[]}
 */
const deepCopy = (obj) => {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key])   //递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

const isEmpty = (value) => {
  if (_.isNumber(value) || _.isBoolean(value)) {
    return false
  }
  if (_.isNil(value)) {
    return true
  }
  if (_.isString(value)) {
    return value.length === 0
  }
  return _.isEmpty(value)
}

const isNotEmpty = (value) => {
  return !isEmpty(value)
}

export default {
  omit, DeepMergeNoExtraProps, deepCopy,isEmpty,isNotEmpty
}
