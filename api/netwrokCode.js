
//网络错误
export const NETWORK_ERROR = 500
export const NOT_FOUND = 404
//网络超时
export const NETWORK_TIMEOUT = 2
//网络返回数据格式化一次
export const NETWORK_JSON_EXCEPTION = 3
export const systemError = -1 //此异常返回时，app 只显示 message,不做任何操作
export const SUCCESS = 200

// token 相关
export const API_ERROR_TOKEN_EXPIRE = 2001   // token 过期
export const API_ERROR_TOKEN_NULL = 2002   // token为空
export const API_ERROR_TOKEN_CANCELLATION = 2003 // token 注销,可能是 其他设备登录了 同一账号，此时当前设备调需要登录 的接口后， 强制 做 退出登录 流程
// refresh 相关
export const API_ERROR_REFRESH_EXPIRE = 2101 // refresh 过期
export const API_ERROR_REFRESH_CANCELLATION = 2103 // refresh 注销
export const API_ERROR_REFRESH_DEVICE = 2104    //  refresh  非本设备操作
export const refreTokenInvalid = 101 //refreshtoken  失效
export const refreshErr = 100// refresh错误
export const notbindPhone = 2010//未绑定手机
export const USER_BANNED = 40101 // The user was disabled because of violation of certain provisions
export const TOKEN_EXPIRED = 40102
export const PARAM_BLANK = 422
export const Unauthorized = 401// "Your request was made with invalid credentials."

// export function handlerError ({
//                                 code, data, message
//                               }) {
//   switch (code) {
//     case -1: {//业务逻辑层 错误。只 弹 toast
//     }
//       break
//     case 401:
//       //授权逻辑
//       return '未授权或授权失败'//401 Unauthorized
//     case 403:
//       return '403权限错误'
//     case 404:
//       return '404错误'
//     case 410:
//       return '410错误'
//     case NETWORK_TIMEOUT:
//       //超时
//       return '网络超时'
//     default:
//
//       return '其他异常'
//   }
//
// }
