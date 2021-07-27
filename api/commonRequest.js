import { View, Image, StyleSheet, Platform } from 'react-native';
import tool from '../tools/tool';
import HttpManager from './HttpManager';
import * as netwrokCode from './netwrokCode';
import * as stringTools from '../tools/stringTools';

export default async function ({
  url,
  params = {},
  method = 'GET',
  timeoutMs,
  text = false,
  promptForCustomToast = false,
  header,
  token,
}) {
  // Add the public parameters to be passed in each api
  const initCommonParams =
    method === 'GET'
      ? {
          // longitude: gDeviceInfo.location?.longitude,
          // latitude: gDeviceInfo.location?.latitude,
          // deviceID: gDeviceInfo.UniqueID,
          // brand: gDeviceInfo.brand,
          // model: gDeviceInfo.model,
          // uid: gUserInfo.data.uid, mac: gDeviceInfo.mac,
          // v: gDeviceInfo.appVersion,
          // platform: Platform.OS,
          // 'access-token': auth.access_token
        }
      : {};

  // if (!stringTools.isNull(auth.access_token) && (method === 'POST' || method === 'PUT')) {
  //   url = `${url}?access-token=${auth.access_token}`
  // }

  // if (gConstant.fakeData) {
  //   url = `${url}?access-token=aJz_M5QokK934C4XAb9nil8Rz7tW3sac_1598850330`
  // }

  const [err, res] = await tool.to(
    HttpManager.netFetch({
      url: url,
      params: /* (params instanceof Array) ? params : */ {
        ...params,
        ...initCommonParams,
      },
      method,
      timeoutMs,
      text,
      header,
    })
  );

  if (res) {
    // success
    console.log(
      'commonRequest success',
      ' \n [Full url]',
      res.totalUrl,
      ' \n [header]',
      res.header,
      ' \n [url]',
      url,
      '\n [params]',
      params,
      ' \n' + ' [res]',
      res,
      ' \n [err]',
      err
    );

    return Promise.resolve(res.responseJson);
  } else {
    // fail
    console.log(
      'commonRequest fail',
      ' \n [Full url]',
      err.totalUrl,
      ' \n [header]',
      err.header,
      ' \n [url]',
      url,
      '\n [params]',
      params,
      ' \n' + ' [err]',
      err
    );
    let code = err.responseJson.data?.code;
    if (!code) {
      code = err.responseJson.code;
    }
    let message = err.responseJson.data?.message;
    if (!message) {
      message = err.responseJson.message;
    }
    if (err instanceof Error) {
      return Promise.reject(message);
    } else if (code === netwrokCode.NETWORK_TIMEOUT) {
      return Promise.reject(message);
    } else if (code === netwrokCode.NETWORK_ERROR) {
      return Promise.reject(message);
    } else if (code === netwrokCode.PARAM_BLANK) {
      if (!promptForCustomToast) {
      }
      return Promise.reject(message);
    } else if (
      code === netwrokCode.USER_BANNED ||
      code === netwrokCode.TOKEN_EXPIRED ||
      code === netwrokCode.Unauthorized
    ) {
      return Promise.reject(err.responseJson.data);
    } else {
      return Promise.reject(err.responseJson.data);
    }
  }
}
