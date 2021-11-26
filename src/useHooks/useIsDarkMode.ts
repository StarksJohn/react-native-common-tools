import { useColorScheme } from 'react-native'

/**
 * 判断当前操作系统是否是暗黑模式
 * Determine whether the current operating system is in dark mode
 */
export default () => {
  return useColorScheme() === 'dark'
}
