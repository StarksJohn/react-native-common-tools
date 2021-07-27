import AsyncStorage from '@react-native-community/async-storage';
import * as stringTools from './stringTools';
import tool from './tool';
/**
 *
 * @param key
 * @param value 最好是 str 类型，其他类型真机ios 报错
 * @returns {Promise<void | *>}
 */
const setItem = async (key, value) => {
  try {
    console.log('asyncStorage.js setItem key=', key, ' value=', value);
    console.log('asyncStorage.js setItem key= typeof value=', typeof value);
    if (typeof value === 'string' && stringTools.isNull(value)) {
      // alert('setItem 参数不是 str 类型,value=', value)
      // console.log('setItem 参数不是 str 类型,value=', value, ' key=', key)
      console.log('asyncStorage.js setItem key=', key, ' value不存在');
      return Promise.reject('setItem value不存在');
    } else if (typeof value !== 'string') {
      console.log('asyncStorage.js setItem value !== string');
      let v = JSON.stringify(value);

      // if (value instanceof Array) {
      //   //数组类型
      //   console.log('asyncStorage.js setItem value 是 数组');
      //   v = JSON.stringify(value); //value.toString();
      // } else {
      //   //其他类型
      //   v = JSON.stringify(value);
      // }
      if (!stringTools.isNull(v)) {
        const [err, res] = await tool.to(AsyncStorage.setItem(key, v));
        console.log(
          'asyncStorage.js setItem key=',
          key,
          ' value=',
          v,
          ' res=',
          res,
          ' err=',
          err,
        );

        if (err) {
          return Promise.reject(err);
        } else {
          return Promise.resolve(true);
        }
      }
    } else {
      console.log('asyncStorage.js setItem key=', key, ' value=', value);
      const [err, res] = await tool.to(AsyncStorage.setItem(key, value));
      if (err) {
        return Promise.reject(err);
      } else {
        return Promise.resolve(true);
      }
    }
  } catch (e) {
    // saving error
    // throw new Error(`缓存 key=${key}的 失败`);
    return Promise.reject(`缓存 key=${key}的 失败`);
  }
};

const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
};

const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      if (stringTools.isJsonStr(value)) {
        console.log(
          'asyncStorage.js getItem成功 && 是json字符串, key=',
          key,
          '  value=',
          JSON.parse(value),
        );
        return Promise.resolve(JSON.parse(value));
      } else {
        console.log(
          'asyncStorage.js getItem成功 && 不是 json 字符串, key=',
          key,
          '  value=',
          value,
        );
        return Promise.resolve(value);
      }
    } else {
      console.log(`未找到 key=${key}的 缓存`);
      return Promise.reject(null);
    }
  } catch (e) {
    // error reading value
    // throw new Error(`未找到 key=${key}的 缓存`)
    console.log(`未找到 key=${key}的 缓存`);
    return Promise.reject(null);
  }
};

export default {
  setItem,
  removeItem,
  getItem,
};
