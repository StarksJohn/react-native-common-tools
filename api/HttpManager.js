/**
 * Network request
 */
import { Platform } from 'react-native';
import * as netwrokCode from './netwrokCode';
import tool from '../tools/tool';
import * as stringTools from '../tools/stringTools';

export const CONTENT_TYPE_JSON = 'application/json';
export const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded';
export const multipart_form_data = 'multipart/form-data';

const isIos = Platform.OS === 'ios';
export const optionParams = {
  timeoutMs: 10000, // Timeout MS
  token: null,
  authorizationCode: null, // token
};

export const sslPinning = {
  certs: ['cxa'], // your certificates name (without extension), for example cert1.cer, cert2.cer
};

export const commonParams = () => {
  // const auth = store.getState().Auth || {}

  return {
    // model: stringTools.encodeStringContainingChinese(gDeviceInfo.model),
    // appVersion: stringTools.encodeStringContainingChinese(gDeviceInfo.appVersion),
    // brand: stringTools.encodeStringContainingChinese(gDeviceInfo.brand),
    // mac: gDeviceInfo.mac,
    platform: Platform.OS,
    // UniqueID: gDeviceInfo.UniqueID,
    // systemVersion: gDeviceInfo.systemVersion,
    // ip: gDeviceInfo.ip,
    // deviceId: gDeviceInfo.deviceId,
    // manufacturer: stringTools.encodeStringContainingChinese(gDeviceInfo.manufacturer),
    // androidid: gDeviceInfo.androidid,
    // userAgent: stringTools.encodeStringContainingChinese(gDeviceInfo.userAgent),
    // carrier: stringTools.encodeStringContainingChinese(gDeviceInfo.carrier),
    // 'X-Api-Key': auth.access_token,
    'Content-Type': CONTENT_TYPE_JSON,
    Accept: 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    e_platform: 'mobile',
  };
};

const HttpManager = function () {
  console.log('HttpManager construct ');
  this.init();
};

HttpManager.prototype.init = async function () {
  console.log('HttpManager init ');

  this.optionParams = optionParams;

  /**
   * Format JSON request parameters
   */
  this.formParamsJson = (method, params, headers) => {
    // const body = /* headers['Content-Type'].indexOf('multipart/form-data') !== 0 ? */  // : params

    return {
      method: method,
      // headers: new Headers({
      //   'Content-Type': CONTENT_TYPE_JSON,
      //   Accept: 'application/json; charset=utf-8',
      //   'Access-Control-Allow-Origin': '*',
      //   e_platform: 'mobile',
      //   ...(headers || {})
      // }),
      headers,
      body: JSON.stringify(params),
    };
  };

  /**
   * Format form request parameters
   */
  this.formParams = (method, params, headers) => {
    const str = [];
    for (const p in params) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
    }
    let body = null;
    if (str.length > 0) {
      body = str.join('&');
    }
    return {
      method: method,
      // headers: new Headers({
      //   'Content-Type': CONTENT_TYPE_JSON,
      //   Accept: 'application/json; charset=utf-8',
      //   'Access-Control-Allow-Origin': '*',
      //   e_platform: 'mobile',
      //   ...(headers || {})
      // }
      // ),
      headers,
      body,
    };
  };

  /**
   * Overtime management
   */
  this.requestWithTimeout = (ms, promise, text) => {
    // console.log('requestWithTimeout base=', base)
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        resolve({
          status: netwrokCode.NETWORK_TIMEOUT,
          message: 'Network Timeout',
        });
      }, ms);
      promise.then(
        (res) => {
          clearTimeout(timeoutId);
          if (text) {
            resolve(res.text());
          } else {
            resolve(res);
          }
        },
        (err) => {
          clearTimeout(timeoutId);
          resolve(err);
        }
      );
    });
  };

  /**
   * Initiate network request
   * @param url
   * @param method
   * @param params
   * @param json ：need a parameter request in JSON format
   * @param header
   * @param text ，default json  ；text=true, return html string
   * @param timeoutMs
   * @return {Promise.<*>}
   */
  this.netFetch = async ({
    url,
    method = 'POST',
    params = {},
    json = true,
    header = {},
    text = false,
    timeoutMs = this.optionParams.timeoutMs,
  }) => {
    const headers = Object.assign(commonParams(), header);

    let requestParams, body;
    if (method === 'POST' || method === 'PUT') {
      // post | PUT
      if (json) {
        requestParams = this.formParamsJson(method, params, headers);
      } else {
        requestParams = this.formParams(method, params, headers);
      }
      body = requestParams.body;
    } else {
      // get
      requestParams = this.formParams(method, params, headers);
      if (requestParams.body) {
        url += `?${requestParams.body}`;
      }
      delete requestParams.body;
    }

    console.log('HttpManager url: ', url);
    console.log('HttpManager params: ', params);
    console.log('HttpManager requestParams: ', requestParams);
    // console.log('HttpManager body: ', body)

    // console.log('HttpManager timeoutMs: ', timeoutMs)

    // const [err, response] = await tool.to(this.requestWithTimeout(timeoutMs, fetch(url, requestParams), text))
    // console.log('HttpManager url=', url, '  requestWithTimeout response= ', response)

    const [err, response] = await tool.to(
      fetch(url, {
        method: method,
        timeoutInterval: 10 * 1000, // milliseconds
        body,
        // your certificates array (needed only in android) ios will pick it automatically
        // sslPinning: sslPinning,
        headers: requestParams.headers,
      })
    );
    if (response) {
      console.log('HttpManager url=', url, ' \n fetch response= ', response);
      if (text) {
        return Promise.resolve(response.text());
      } else {
        if (
          response instanceof Error ||
          response.status !== netwrokCode.SUCCESS
        ) {
          console.log(
            'HttpManager.js response instanceof Error || response.status !== netwrokCode.SUCCESS err=',
            err
          );

          if (response instanceof Error) {
            console.log('HttpManager.js response instanceof Error ');
            return Promise.reject(response);
          } else {
            const [err_responseJson, responseJson] = await tool.to(
              response.json()
            ); // response.status !== netwrokCode.SUCCESS
            console.log(
              'HttpManager.js response.status !== netwrokCode.SUCCESS response.status=',
              response.status,
              ' responseJson=',
              responseJson
            );
            return Promise.reject({
              responseJson,
              totalUrl: url,
              header: requestParams,
            });
          }
        } else {
          //
          const [err_responseJson, responseJson] = await tool.to(
            response.json()
          ); // Serialized the return value
          if (err_responseJson || !responseJson) {
            console.log(
              'HttpManager.js Failed to serialize return value responseJson=',
              responseJson
            );
            return Promise.reject({
              responseJson,
              totalUrl: url,
              header: requestParams,
            });
          } else {
            // console.log('After the returned parameters are serialized=: ', responseJson)
            if (response.status === 200) {
              // fetch success
              console.log(
                'HttpManager fetch success responseJson=',
                responseJson
              );
              return Promise.resolve({
                responseJson,
                totalUrl: url,
                header: requestParams,
              });
            }
          }
        }
      }
    } else {
      console.log(`HttpManager fetch error= ${err}`);
      return Promise.reject({ err, totalUrl: url, header: requestParams });
    }

    // if (text) { //
    //   console.log()
    //   // return Promise.resolve({
    //   //   data: response,/* */
    //   //   code: 0
    //   // })
    // } else {
    //   if (err || response instanceof Error || response.status !== netwrokCode.SUCCESS) {
    //     console.log('HttpManager.js err=', err)
    //     console.log('HttpManager.js response=', response)
    //
    //     if (response instanceof Error) {
    //       console.log('HttpManager.js response instanceof Error ')
    //       return Promise.reject(response)
    //     } else if (response) {
    //       const [err, responseJson] = await tool.to(response.json())// Serialized the return value
    //       console.log('HttpManager.js response.status=', response.status, ' responseJson=', responseJson)
    //       return Promise.reject({ responseJson, totalUrl: url, header: requestParams })
    //     }
    //   }
    //   const [err, responseJson] = await tool.to(response.json())// Serialized the return value
    //   if (err || !responseJson) {
    //     console.log('HttpManager.js Failed to serialize return value response=', response)
    //     return Promise.reject({ responseJson, totalUrl: url, header: requestParams })
    //   }
    //   // console.log('After the returned parameters are serialized=: ', responseJson)
    //   if (response.status === 200) { //
    //     return Promise.resolve({ responseJson, totalUrl: url, header: requestParams })
    //   }
    // }
  };
};

const singleton = function () {
  let instance;
  return function () {
    if (!instance) {
      instance = new HttpManager();
    }
    return instance;
  };
};

export default new singleton()();
