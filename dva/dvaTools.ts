import asyncStorage from '../tools/asyncStorage'
import _ from 'lodash'
import { cacheAnAttributeOfInitStateProps } from 'react-cacheable-dva'

/**
 * 缓存 initState 的某个属性,如果这个属性再 attributesToBeCached 里注册了的话
 * @param key
 */
export function cacheAnAttributeOfInitState ({ key, value, attributesToBeCached }: cacheAnAttributeOfInitStateProps) {
  const index = _.indexOf(attributesToBeCached, key)
  if (index !== -1) {
    console.log('tool.js 开始缓存 initState.', key, ' 的值=', value)
    asyncStorage.setItem(key, value).then()
  }
}
