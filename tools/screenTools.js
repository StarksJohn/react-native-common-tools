import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

// https://juejin.im/post/5c4949bc6fb9a049bd42a6eb
// iPhone X、iPhone XS
const X_WIDTH = 375;
const X_HEIGHT = 812;
// iPhone XR、iPhone XS Max
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const DEVICE_SIZE = Dimensions.get('window');
const { height: D_HEIGHT, width: D_WIDTH } = DEVICE_SIZE;
export const isiOS = () => Platform.OS === 'ios';
export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

/**
 * Convert the designed px into dp to adapt to different screens in proportion
 * @param designPx
 * @returns {number}
 */
export function dp(designPx) {
  // return PixelRatio.roundToNearestPixel((designPx * 2 / 750) * deviceWidth) //
  return scaleSize(designPx);
}

// 像素密度
export const DEFAULT_DENSITY = 2;
global.gScreenOrientation = 'PORTRAIT'; // 屏幕当前状态   LANDSCAPE | PORTRAIT
global.PORTRAIT = 'PORTRAIT';
// px转换成dp
// 以iphone11 基准,如果以其他尺寸为基准的话,请修改下面的750和1334为对应尺寸即可.
const w2 = 750 / DEFAULT_DENSITY;
// px转换成dp
const h2 = 1624 / DEFAULT_DENSITY;

/**
 * 屏幕适配,缩放所有视图的size,根据屏幕适配，保证不同屏幕显示的 比例一致
 * 屏幕旋转后，此方法的 结果必须 重新计算，故 scale 不能 写死
 * 坑: 根据屏幕宽度计算出的 单位不能 被此方法 包裹，否则 =不同屏幕宽度就不一致了
 * gScreenOrientation: 屏幕旋转后 改变
 * @param size
 * @returns {number}
 */
const scaleSize = (size) => {
  const w = deviceWidth; // Dimensions.get('window').width
  const h = deviceHeight; // Dimensions.get('window').height
  const scaleWidth =
    gScreenOrientation === PORTRAIT
      ? w / w2
      : // MathUtils.subtract(w,w2,4) :
        w / h2;
  // MathUtils.subtract(w,h2,4);
  const scaleHeight =
    gScreenOrientation === PORTRAIT
      ? h / h2
      : // MathUtils.subtract(h,h2,4)
        // : MathUtils.subtract(h,w2,4);
        h / w2;
  const scale = Math.min(scaleWidth, scaleHeight); // 返回 2个 参数中最小的值

  // 可把一个数字舍入为最接近的整数,例如，3.5 将舍入为 4，而 -3.5 将舍入为 -3。
  size = Math.round(
    size * scale +
      // MathUtils.multiply(size,scale,4)
      0.5
  ); // 避免精度缺失 +0。5
  return (size / DEFAULT_DENSITY) * 2;
  // MathUtils.subtract(size,defaultPixel,4)
};

const _isIphoneX = (() => {
  const is =
    (isiOS() &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) || // 竖屏
        (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))) || // 横屏
    (D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
    (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT);
  return is;
})();

// Get the height of the status bar
export function getStatusBarHeight() {
  return Platform.select({
    ios: ifIphoneX(44, 20),
    android: StatusBar.currentHeight,
  });
}

/**
 *
 * @returns {boolean}
 */
export function isIphoneX() {
  return _isIphoneX;
}

/**
 *
 * @param iphoneXStyle
 * @param iosStyle
 * @param androidStyle
 * @returns {*}
 */
export function ifIphoneX(iphoneXStyle, iosStyle = {}, androidStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  } else if (Platform.OS === 'ios') {
    return iosStyle;
  } else {
    if (androidStyle) {
      return androidStyle;
    }
    return iosStyle;
  }
}
