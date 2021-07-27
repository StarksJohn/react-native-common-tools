/**
 * Created by Ebates on 16/12/13.
 * ArrayUtils
 * 数组的扩展方法
 * 给 Array.prototype上添加的方法和属性，名字别和 系统方法或系统变量的名字重名，否则 所有 其他库调到系统方法或变量时，就会调你自己重写的方法,导致BUG
 */

/**
 * 返回 2个数组里相同的元素
 * @param array2
 * isSame : true: 返回相同的元素; false:返回不同元素
 * @returns {Array}
 */
Array.prototype.sf_filterSameEle = function (array2) {
  //临时数组存放
  let tempArray1 = []//临时数组1
  let tempArray2 = []//临时数组2

  for (let i = 0; i < array2.length; i++) {
    tempArray1[array2[i]] = true//将数array2 中的元素值作为tempArray1 中的键，值为true；
  }

  for (let i = 0; i < this.length; i++) {
    if (tempArray1[this[i]]) {
      tempArray2.push(this[i])//过滤array1 中与array2 相同的元素；
    }
  }

  return tempArray2
}

/**
 * http://www.cnblogs.com/yeyuchangfeng/p/6237819.html
 * 数组是否包含某对象
 * @param v
 * @returns {*|Number|number}
 */
Array.prototype.isContainValue = function (v) {
  for (let i in this) {
    // Log.log('i下标  ='+i + ' arr[i] '+this[i] );

    if (this[i] === v) {

      return true
    }
  }

  // Log.log('sf_isContainValue false  '+v);

  return false
}

/**
 * 返回 数组里 满足 predicateFunc 方法 筛选条件的 对象的 下标，满足后直接 自动 break
 * @param predicateFunc:
 *              eg: 返回 数组里 满足 id==0 的 对象 的 下标
 *                   (element)=>{
                        return element.id==0
                     }
 */
Array.prototype.sf_findObjIndex = function (predicateFunc) {
  return this.findIndex(predicateFunc)
}

/**
 * 根据 谓词 返回 满足条件的 数组元素，只返回 第一个满足条件的 数组元素，因 底层遍历数组应该是 正序
 * @param predicateFunc
 *                   (element)=>{
                        return element.id==0
                     }
 * @returns {number}
 */
Array.prototype.sf_findObjWithPredicate = function (predicateFunc) {
  let index = this.findIndex(
    predicateFunc
  )
  if (index != -1) {
    return this[index]
  }

  return null
}

/**
 * js删除数组里的某个元素
 * http://caibaojian.com/js-splice-element.html
 * @param val
 * @returns {number}
 */
Array.prototype.sf_remove = function (val) {
  let index = this.sf_indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

/**
 * @param arr
 * @param predicateFunc : (element)=>{
                        return element.id==0
                     }
 */
const removeObject = (arr, predicateFunc) => {
  const index = arr.findIndex(predicateFunc);
  arr.sf_removeObjectAtIndex(index);
};

/**
 * 删某个下标对应的元素
 * @param i
 */
Array.prototype.sf_removeObjectAtIndex = function (i) {
  if (i > -1) {
    this.splice(i, 1)
  }
}

/**
 * 从 i 下标开始 删 nums 个数据
 * @param i
 * @param nums
 */
Array.prototype.sf_removeAtIndexAndNums = function (i, nums) {
  if (i > -1) {
    this.splice(i, nums)
  }
}

Array.prototype.sf_indexOf = function (val) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] == val) return i
  }
  return -1
}

/**
 * 返回2个数组的不同元素
 * @param arr
 * @returns {Array.<*>}
 */
Array.prototype.sf_difference = function (arr) {
  return this
    .filter(x => arr.sf_indexOf(x) === -1)
    .concat(arr.filter(x => this.sf_indexOf(x) === -1))
}

/**
 * 返回 数组里 符合 predicateFunc 条件的 元素的 某个key 的 集合
 * @param predicateFunc
 * @returns {*}
 */
const sf_filter = (arr, predicateFunc) => {
  return arr.map(
    (value, index, array) => {
      // console.log(value)
      return predicateFunc(value, index)
    }
  )
}

Array.prototype.sf_empty = function () {
  this.splice(0, this.length)
}

/**
 * 用 一个对象的所有 values  初始化一个 新数组
 * @param obj
 * @returns {any[]}
 */
Array.prototype.sf_initWithArray = function (obj) {
  //为了 低版本的 IOS和安卓系统，暂时用ES5
  // let values=[];
  // Object.keys(obj).map(
  //     (key, idx) => {
  //         values.push(obj[key]);
  //     }
  // )
  // return values;
  return Array.from(
    Object.values(obj)
  ).map(
    (val, i) => {
      return val
    }
  )
}

/*
用 分隔符 把数组元素 拼接 成一个 字符串
如 sep:'' ,这样字符串的字母之间就没有分隔符
 */
Array.prototype.sf_join = function (sep) {
  return this.join(sep)
}

/**
 * http://www.jb51.net/article/67458.htm
 * 排序规则函数 类型
 * @type {{NumAscSort(*, *): number, NumDescSort(*, *): number}}
 */
export const sortType = {
  /**
   * http://www.jb51.net/article/67458.htm
   * 数组排序时提供的 排序规则函数，用于把数组元素 按照字符编码的顺序 升序排序，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b
   * @param a
   * @param b
   * @returns {number}
   * @constructor
   */
  NumAscSort (a, b) {
    return a - b
  },

  /**
   * http://www.jb51.net/article/67458.htm
   * 数组排序时提供的 排序规则函数，用于把数组元素 按照字符编码的顺序 降序排序，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b
   * @param a
   * @param b
   * @returns {number}
   * @constructor
   */
  NumDescSort (a, b) {
    return b - a
  }
}

/**
 * http://www.jb51.net/article/67458.htm
 * 对象数组的 排序 ,按 sortType 的 类型  进行 0  升序或 1 降序 排序
 * key1:每个数组元素都有的key，按这个key的值对数组元素进行 排序,如果key的 值是 number，则按 sortType的值对 number 进行排序
 * key2:每个数组元素都有的key，当key1相同时，用key2 排序。默认 传 ""
 */
Array.prototype.sf_sortObjectArr = function (key1, key2, sortType = 0/*外部不传此参数时，默认是0，升序排序*/) {
  //by函数接受一个成员名字符串和一个可选的次要比较函数做为参数并返回一个可以用来包含该成员的对象数组进行排序的比较函数，当o[age] 和 p[age] 相等时，次要比较函数被用来决出高下
  let by = function (key1, key2) {
    return function (o, p) {
      let a, b
      if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[key1]
        b = p[key1]
        if (a === b) {
          return typeof key2 === 'function' ? key2(o, p) : 0
        }
        if (typeof a === typeof b) {
          return sortType === 0 ? (a < b ? -1 : 1 /*升序*/) : (a < b ? 1 : -1/*降序*/)//;
        }
        return sortType === 0 ? (typeof a < typeof b ? -1 : 1) : (typeof a < typeof b ? 1 : -1)
      } else {
        throw('error')
      }
    }
  }

  this.sort(by(key1, by(key2)))
}

/**
 * 对数组元素是 基本数据类型 的数组进行排序
 * sortFunc: 排序规则函数,sortType里的类型
 * http://www.jb51.net/article/67458.htm
 */
Array.prototype.sf_sortBasicDataArr = function (sortFunc) {
  this.sort(sortFunc)
}

/**
 * 数组 插入 元素 到指定位置
 * @param index
 * @param item
 */
Array.prototype.sf_insert = function (index, item) {
  this.splice(index, 0, item)
}

/**
 * 数组去重
 * http://blog.csdn.net/fungleo/article/details/54931379
 * @param array
 * @returns {*[]}
 */
Array.prototype.sf_dedupe = function () {
  return [...new Set(this)]
}

/**
 *  扩展运算符实现数组的 深拷贝
 * https://www.cnblogs.com/lvonve/p/11334628.html
 * @param obj
 * @returns {*}
 */
const deepCopyArr = obj => {
  // return [...this]// 不能用  {...this}，因为 this 是 array类型，深拷贝出来的类型也得是 [] 类型
  var newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  }
  for (const i in obj) {
    newobj[i] = typeof obj[i] === "object" ? deepCopyArr(obj[i]) : obj[i];
  }
  return newobj;
};

/**
 *  扩展运算符实现数组的深拷贝
 *  http://blog.csdn.net/fungleo/article/details/54931379
 * @param obj
 * @returns {*}
 */
Array.prototype.sf_deepCopyArr = function () {
  return [...this]// 不能用  {...this}，因为 this 是 array类型，深拷贝出来的类型也得是 [] 类型

}

/**
 * https://www.cnblogs.com/lvmh/p/6104397.html
 * 优化版for循环 ,是所有循环遍历方法中性能最高的一种
 * 比 forEach 性能好，因 forEach 跳出循环 很麻烦 https://www.cnblogs.com/PheonixHkbxoic/p/5708749.html
 * @param cb ,(i)=>{
 *  ...
 *  return xxx  xxx为1时 ，break for 循环,2时continue， 否则 不 break
 * }
 * @param arr
 */
Array.prototype.forLoop = function (cb) {
  let result = null
  for (let i = 0, len = this.length; i < len; i++) {
    if (cb) {
      result = cb(this[i], i)
      // if (result == 1) {
      //     break;
      // } else
      if (result == 2) {
        continue
      } else if (result) {//result 可能为 对象 或者 true，只要满足 外部条件
        break //跳出循环
      }
    }
  }
  return result
}

/**
 * 交换数组元素位置
 * http://www.fly63.com/article/detial/1089
 */
Array.prototype.exchangeItemIndex = function (index1, index2) {
  this.splice(index2, 1, ...this.splice(index1, 1, this[index2]))
}

/*
一维数组变成二维数组
 */
const oneToTwoDimensional = (array) => {
  let arr = []
  array && array.map(
    (value, index, array) => {
      if (arr.length > 0) {
        if (arr[arr.length - 1].length === 1) {//最后一行数组元素只有一个对象
          arr[arr.length - 1].push(value)
        } else {
          arr.push([value])
        }
      } else {
        arr.push([value])
      }
    }
  )
  return arr
}

/**
 * 二维数组 变 一维数组
 * @param arr
 */
const twoToOneArr = (array) => {
  let arr = []
  array && array.map(
    (value, index, array) => {
      if (value instanceof Array) {
        value.map(
          (value1, index1, array) => {
            arr.push(value1)
          }
        )
      }
    }
  )
  return arr
}

/**
 * http://c.biancheng.net/view/5668.html
 * 数组元素截取，因 slice 方法的截取 传参很恶心，第 1 个参数指定起始下标位置，包括该值指定的元素；第 2 个参数指定结束位置，不包括指定的元素。所以 此方法 的传参 统一成 0开始的 数组下标 [startIndex,endIndex],起始下标和结束下标都包括
 */
const slice = (startIndex, endIndex, arr) => {
  const res = arr.slice(startIndex, endIndex + 1)
  return res
}

/**
 * 获取数组最后一个元素
 * @param arr
 * @returns {*}
 */
const getLastOne = arr => {
  return arr.slice(-1)[0];
};

export default {
  oneToTwoDimensional, sf_filter, twoToOneArr, slice, removeObject,
  deepCopyArr,getLastOne
}


