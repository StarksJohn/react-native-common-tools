/**
 * Created by Ebates on 16/12/28.
 * Math
 * 计算相关
 */

/**
 * 生成 [min,max] 的随机数 http://www.cnblogs.com/javaScriptYang/p/5684797.html
 * @param min
 * @param max
 */
export function randomNums (min, max) {
  // let a= parseInt(Math.random()*(max-min+1)+min,10);
  //  Log.log('a==='+a);
  let b = Math.floor(Math.random() * (max - min + 1) + min)
  // Log.log('b===' + b);
  // showToast('产生新随机数===' + b);
  return b
}

/**
 * 丢弃小数部分,保留整数部分 http://www.ablanxue.com/shtml/201407/23258_1.shtml
 * @param n
 * @returns {Number}
 * @constructor
 */
export function Math_parseInt (n) {
  return parseInt(n)
}

/**
 * 把 nums 数字 改成 小数点右边保留 digit 位小数 && 四舍五入
 * @param nums  原生数字
 * @param digit 小数点右边需要 保留几位
 * @constructor
 */
export function KeepDigitsDecimalPlaces (nums, digit) {
  return nums.toFixed(digit)
}

/**
 * 把 nums 数字 改成 小数点右边保留 digit 位小数 && 不四舍五入小数点2位右边的
 * @param nu
 */
export function noRounding (num, digit) {
  const res = (parseInt(num * 100) / 100).toFixed(digit)
  // console.log('noRounding num=', num, ' digit=', digit, ' res=', res)
  return res
}

/**
 * 计算 绝对值, 不知道为啥外部 调用就报错
 * @param value
 * @returns {number}
 * @constructor
 */
// export function AbsoluteValue(value) {
//     return Math.abs(value)
// }

/**
 * 字符串转 number http://www.jb51.net/article/59240.htm
 * @param str
 * @returns {*}
 */
export function strToNum (str) {
  return parseInt(str)
}

/**
 * 返回 一个数字 被 小数点 切割后的 数组，可判断是否 有 小数点
 * @param num
 */
export function isDot (num) {
  return (num.toString()).split('.')
}
