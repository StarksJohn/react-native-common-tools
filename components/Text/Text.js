import React from "react";
import { StyleSheet, Platform, Text } from "react-native";
import { fontWeightToFontFamily } from "./getFontFamily";
import objTools from "../../tools/objTools";

/**
 * https://juejin.im/post/5ce66c26e51d4555fd20a2a0
 * App字体大小不随系统字体大小的改变而改变
 */
const TextRender = Text.render;
Text.render = function (...args) {
  const originText = TextRender.apply(this, args);
  return React.cloneElement(originText, { allowFontScaling: false });
};

const baseT = ({ style, ...props }) => {
  const { hasPaddingLeftAndRight } = props;
  const _style = style;

  // Text styles
  let resolvedStyle = StyleSheet.flatten(_style) || {};
  // 根据 fontWeight 找到 fontFamily
  resolvedStyle = fontWeightToFontFamily(resolvedStyle);
  // 过滤掉 Text styles 中的 fontWeight fontStyle 得到新的 styles 对象
  const newStyle = objTools.omit({ ...resolvedStyle }, [
    "fontStyle",
    "fontWeight",
  ]); //

  // 外部设置 lineHeight 时 不建议 带上 gScaleSize，因 字体大小没缩放
  if (
    props.numberOfLines >= 2 &&
    !newStyle.lineHeight &&
    Platform.OS === "android"
  ) {
    // 2 行以上在安卓上 显示有问题，必须加 lineHeight
    newStyle.lineHeight = newStyle.fontSize * 1.5;
  }

  if (!hasPaddingLeftAndRight) {
    newStyle.paddingLeft = 0;
    newStyle.paddingRight = 0;
  }

  if (!newStyle.alignSelf) {
    // 避免text的width被默认填充其父视图width，故给 alignSelf 设置默认值;View 也是如此
    newStyle.alignSelf = "flex-start";
  }

  // console.log('newStyle=', newStyle)
  return (
    <Text
      {...props}
      // selectable={true}
      style={newStyle}
    />
  );
};

export default baseT;
