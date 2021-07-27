// import RN组件 代码模板
import React from 'react';
import { Toast } from 'teaset';
import Text from './Text/Text'

let toastKey = null;

export default function ({
  style,
  textStyle,
  text,
  duration = 'short',
  position = 'center',
  modal = false,
  icon = null,
}) {
  toastKey && Toast.hide(toastKey);
  toastKey = null;
  toastKey = Toast.show({
    style: [{ borderRadius: 10, style }],
    text: (
      <Text
        style={[
          {
            fontSize: 12,
            color: '#FFFFFF',
            marginHorizontal: 20,
            fontFamily: 'PingFangSC-Regular', //backgroundColor: gRandomColor(),
            marginVertical: 10,
            lineHeight: 16,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    ),
    duration,
    position,
    modal,
    icon,
  });
}
