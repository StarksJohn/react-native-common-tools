/*
 * */
const http = "http://";
const https = "https://";
const testHost = https + "dev-hsbcwsmp.cxaone.cn"; // 1.1.0 version test environment
const onlineHost = https + "";
// The back-end interface version number has nothing to do with the app version number
const version = "v1";

const host = true ? testHost : testHost;

export default {
  host,
  http,
  https,
  testHost,
  version,
  onlineHost,
  app_ver: `${host}/api/${version}/site/app-ver`,
};
