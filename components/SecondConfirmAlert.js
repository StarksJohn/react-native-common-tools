import { View, Platform, Image, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native'
import { Overlay } from 'teaset'


export default function ({
  title, msg, onConfirm, cancelData = {
    text: 'Cancel',
    onPress: null
  }
}) {
  const bts = [
    { text: 'OK', onPress: onConfirm }
  ]
  if (cancelData) {
    bts.push(cancelData)
  }
  /**
   * Because the message parameter of IOS Alert cannot be left aligned, it can only be customized
   */
  const secondConfirmationPopViewOnIOS= ({
                                     title, titleStyle, text, cancleText, onCancelPress, confirmtext, onConfirmPress, confirmTextStyle = {}, textStyle = {}, renderText = null, cancleTextStyle = {}, horizontalLineStyle = {}
                                   }) => {
    const overlayView = (
      <Overlay.PopView
        style={{ alignItems: 'center', justifyContent: 'center' }}
        type='zoomOut'
        modal
        ref={v => this.r_twiceConfirmBox = v}
      >
        <View style={{
          width: dp(270), // height: gScaleSize(100),
          alignItems: 'center', // paddingHorizontal: gScaleSize(10),
          backgroundColor: 'white',
          // backgroundColor: appStyle.randomColor(),
          borderRadius: dp(10) // maxHeight: gScaleSize(300),
        }}
        >
          {
            !stringTools.isNull(title) && <Text style={[{
              fontSize: dp(16),
              color: '#333333',
              alignSelf: 'center',
              fontFamily: 'PingFangSC-Medium',
              marginTop: dp(15)
            }, titleStyle]}
            >{title}</Text>
          }
          {
            renderText ? renderText() : <Text style={[{
              fontSize: dp(14), // backgroundColor: gRandomColor(),
              color: '#666666',
              marginBottom: dp(10),
              maxWidth: '85%',
              alignSelf: 'center',
              textAlign: 'left',
              marginTop: dp(10),
              lineHeight: dp(18)
            }, textStyle]}
            >{text}</Text>
          }

          <View style={[{
            width: '100%',
            height: dp(0.5),
            backgroundColor: '#E6E6E6'
            // marginTop: dp(10)
          }, horizontalLineStyle]}
          />
          <View
            style={{ width: '100%', height: dp(50), flexDirection: 'row' }}
          >
            {
              cancleText && <TextBt
                style={{
                  flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#CCCCCC'// backgroundColor: appStyle.randomColor()
                }}
                disable={false}
                textStyle={{
                  fontSize: dp(16),
                  color: '#CCCCCC',
                  fontFamily: 'PingFangSC-Medium'
                }} title={cancleText}
                onPress={() => {
                  onCancelPress && onCancelPress()
                  this.r_twiceConfirmBox && this.r_twiceConfirmBox.close()
                  this.r_twiceConfirmBox = null
                }}
              />
            }
            {
              confirmtext && <TextBt
                style={{
                  flex: 1// backgroundColor: appStyle.randomColor()
                }}
                disable={false}
                textStyle={{
                  fontSize: dp(16),
                  color: appStyle.appThemeColor,
                  fontFamily: 'PingFangSC-Medium'
                }} title={confirmtext}
                onPress={() => {
                  onConfirmPress && onConfirmPress()
                  this.r_twiceConfirmBox && this.r_twiceConfirmBox.close()
                  this.r_twiceConfirmBox = null
                }}
              />
            }
          </View>
        </View>
      </Overlay.PopView>
    )
    if (!this.r_twiceConfirmBox) {
      Overlay.show(overlayView)
    }
  }

  if (Platform.OS==='ios') {
    this.secondConfirmationPopViewOnIOS({
      title, text: msg, cancleText: 'Cancel', confirmtext: 'OK', onConfirmPress: onConfirm
    })
  } else {
    Alert.alert(
      title,
      msg,
      bts
    )
  }
}
