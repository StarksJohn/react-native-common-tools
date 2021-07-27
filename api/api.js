import Urls from "./Urls";
import tool from '../tools/tool';
import commonRequest from './commonRequest';

export default {
  /**
   * 版本更新接口
   * @param payload
   */
  async app_ver(payload) {
    console.log("api.js app_ver payload=", payload);
    payload = {
      ...{ group: Platform.OS },
      ...payload,
    };
    const [err, data] = await tool.to(
      commonRequest({
        url: Urls.app_ver,
        method: 'GET',
        params: payload,
      })
    );
    if (data) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(null);
    }
  },
};
