/**
 * stringTools.js
 * 给 String.prototype上添加的方法和属性，名字别和 系统方法或系统变量的名字重名，否则 所有 其他库调到系统方法或变量时，就会调你自己重写的方法,导致BUG
 * http://www.cnblogs.com/lhyhappy65/p/6061143.html js中字符串的操作
 * concat  slice    substring  substr  split
 */
import emojiRegex from 'emoji-regex';

// 只去除字符串左边空白
String.prototype.sf_ltrim = function () {
  return this.replace(/(^\s*)/g, '');
};

// 只去除字符串右边空白
String.prototype.sf_rtrim = function () {
  return this.replace(/(\s*$)/g, '');
};

/**
 * Remove the spaces on both sides and the middle of the string
 * /https://blog.csdn.net/weixin_44819874/article/details/108586738
 * @returns {string}
 */
String.prototype.sf_trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '').replace(/\s/g, '');
};

/**
 * str 里 包含 base 字符串的 起始下标，不包含时返回 -1
 * @param str
 * @param text
 */
export function search(str, text) {
  return str.search(text);
}

//  根据个数截取字符串，兼容中英文 http://www.52doit.com/show/457
export function cutStr(str, len) {
  let str_length = 0;

  let str_cut = '';

  // 先算出来字符串原始的长度
  let originalLen = 0;
  for (let i = 0, ilen = str.length; i < ilen; i++) {
    originalLen++;
    if (escape(str.charAt(i)).length > 4) {
      originalLen++;
    }
  }

  for (let i = 0, str_len = str.length; i < str_len; i++) {
    str_length++;
    if (escape(str.charAt(i)).length > 4) {
      str_length++;
    }
    str_cut = str_cut.concat(str.charAt(i));
    if (str_length >= len) {
      // 如果出现11个字符中文混合情况
      if (originalLen !== len + 1) {
        str_cut = str_cut.concat('...');
      }
      return str_cut;
    }
  }
  if (str_length < len) {
    return str;
  }
}

// 用 Delimiter 这个分隔符 把一个字符串分割存储到数组  http://www.cnblogs.com/qj0813/p/5110211.html
String.prototype.sf_splitByDelimiter = function (Delimiter) {
  return this.split(Delimiter);
};

/**
 * 找到字符串里第一个重复出现的字符的下标,如 'abca'就返回 3
 * @param str
 */
String.prototype.sf_findOneIndex = function (str) {
  for (let i = 0; i < str.length; i++) {
    let index = str.indexOf(str[i], str.indexOf(str[i]) + 1);
    if (index !== -1) {
      return index;
    }
  }
};

/**
 * str1里是否包含str2，外部 不要直接用此方法，而是用里边的正则
 * https://www.cnblogs.com/ooo0/p/7741651.html  建议用正则
 * @param str1
 * @param str2
 * @returns {boolean}
 */
export function contain(str1, str2) {
  // indexOf: str第一次在str1里出现的下标
  // return str1.indexOf(str2) > 0
  //
  var str = '123';
  var reg = RegExp(/3/);
  if (str.match(reg)) {
    // 包含
  }
}

/**
 * 判断字符串中是否存在子字符串(不区分大小写)
 * @param str
 * @param subStr
 * @returns {*}
 */
export function coverString(str, subStr) {
  const reg = eval('/' + subStr + '/ig');
  return reg.test(str);
}

// 16进制数转10进制
export function ex16hex(value) {
  value = stripscript(value);
  value = value.replace('0x', '');
  var arr = value.split('');
  arr = arr.reverse();
  var len = arr.length;
  var res = 0;
  arr.map((v, i, array) => {
    var num = hex_change(v);
    console.log(num);
    res += muti16(num, i);
  });
  return res;
}

// 返回 v 乘以 n 个 16 的积
export function muti16(v, n) {
  var temp = v;
  for (var i = 0; i < n; i++) {
    temp *= 16;
  }
  return temp;
}

// 过滤所有特殊字符
export function stripscript(s) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]");
  var rs = '';
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

// 字符转16进制数字
export function hex_change(v) {
  var res;
  switch (v) {
    case 'a':
      res = 10;
      break;
    case 'b':
      res = 11;
      break;
    case 'c':
      res = 12;
      break;
    case 'd':
      res = 13;
      break;
    case 'e':
      res = 14;
      break;
    case 'f':
      res = 15;
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      res = Number(v);
      break;
    default:
      res = 0;
      break;
  }
  return res;
}

/**
 * http://www.cnblogs.com/sj521/p/5623035.html
 * 判断字符串长度
 * @param val
 * @returns {number} 返回的长度是按英文字符判断的,如 中国china=9
 */
export function getStrLen(val) {
  let len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2; // 汉字算两个字符
    } else {
      len += 1;
    }
  }
  return len;
}

//  获取字符串长度，兼容中英文 http://www.52doit.com/show/457, 和 getStrLen 方法结果一样
export function getLength(str) {
  var real_length = 0;

  var char_code = -1;
  for (var i = 0, len = str.length; i < len; i++) {
    char_code = str.charCodeAt(i);
    if (char_code >= 0 && char_code <= 128) {
      real_length += 1;
    } else {
      real_length += 2;
    }
  }
  return real_length;
}

String.prototype.sf_getLength = function () {
  var real_length = 0;

  var char_code = -1;
  for (let i = 0, len = this.length; i < len; i++) {
    char_code = this.charCodeAt(i);
    if (char_code >= 0 && char_code <= 128) {
      real_length += 1;
    } else {
      real_length += 2;
    }
  }
  return real_length;
};

/**
 * 字符串是否包含汉字
 * @param val
 * @returns {boolean}
 */
export function isContainChinese(val) {
  let b = false;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      b = true;
    }
  }
  return b;
}

export function encodeStringContainingChinese(str) {
  let res = str;
  if (!isNull(str) && isContainChinese(str)) {
    res = encodeURI(str);
  }
  return res;
}

/**
 * 检测 字符串是否全是 数字
 * @param text
 * @returns {boolean}
 */
export function isAllNum(val) {
  console.log('stringTools.js isAllNum str=', str);
  const n = Number(str);
  if (!isNaN(n)) {
    console.log('stringTools.js isAllNum ok');
    return true;
  }
  console.log('stringTools.js isAllNum false');

  return false;
}

/**
 * https://www.cnblogs.com/mouseleo/p/12891426.html
 * @param str
 */
export function regularMatchesTheNumbers(str) {
  const num = parseFloat(str.replace(/[^\d]/g, ' '));
  console.log('stringTools.js regularMatchesTheNumbers str=', str, ' num=', num);
  return num;
}

/**
 * 判断 字符串是否为 空、空格、null
 * http://www.jb51.net/article/86543.htm
 * @param str
 */
export function isNull(str) {
  return (
    !str ||
    str.length === 0 ||
    str === '' ||
    str.replace(/(^s*)|(s*$)/g, '').length === 0 ||
    new RegExp('^[ ]+$').test(str) ||
    typeof str === 'null' ||
    typeof str === 'undefined'
  );
}

// 外部 调用时 是 xxx.isNull()
String.prototype.isNull = function () {
  return (
    !this ||
    this.length === 0 ||
    this === '' ||
    this.replace(/(^s*)|(s*$)/g, '').length === 0 ||
    new RegExp('^[ ]+$').test(this) ||
    typeof this === 'null' ||
    typeof this === 'undefined'
  );
};

/**
 * 任何东西转成 str
 * @param value
 * @returns {string}
 */
export function anyThingToString(value) {
  return String(value);
}

/**
 * 判断是否为电话号码，并返回提示信息
 * @param phoneNumber ：str
 * @returns {{isValid: boolean, msg: string}}
 */
export function checkPhoneNumber(phoneNumber) {
  let msg = '';
  if (typeof phoneNumber === 'string') {
    if (isNull(phoneNumber)) {
      msg = '请输入手机号码';
    } else if (/^1\d{10}$/.test(phoneNumber) === false) {
      msg = '请输入有效的手机号码';
    }

    let valid = !(msg.length > 0);

    return {
      isValid: valid,
      msg: msg,
    };
  } else {
    alert('checkPhoneNumber phoneNumber参数应该传 str 类型');
  }
}

/**
 * 普通字符串转化成 '￥xxx.000' 格式的 价格字符串
 * @returns {string}
 * @constructor
 */
String.prototype.sf_RMB = function () {
  let s = this;
  if (/[^0-9\.]/.test(s)) {
    return 'invalid value';
  }
  s = s.replace(/^(\d*)$/, '$1.');
  s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1');
  s = s.replace('.', ',');
  let re = /(\d)(\d{3},)/;
  while (re.test(s)) {
    s = s.replace(re, '$1,$2');
  }
  s = s.replace(/,(\d\d)$/, '.$1');
  return '￥' + s.replace(/^\./, '0.');
};

/*
判断忽略大小写比较两个字符串是否相等
http://blog.csdn.net/sinat_17775997/article/details/59118631
 */
String.prototype.sf_equalsIgnoreCase = function (str) {
  return str && this.toUpperCase() === str.toUpperCase();
};

// http://www.jb51.net/article/68694.htm  JavaScript检测字符串中是否含有html标签
String.prototype.sf_checkHtml = function () {
  let reg = /<[^>]+>/g;
  return reg.test(this);
};

// 检测 字符串 是否是 url 地址
String.prototype.sf_checkUrl = function () {
  let RegUrl = new RegExp();
  RegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$');
  if (!RegUrl.test(this)) {
    return false;
  }
  return true;
};

/**
 * 从 str里 找出 substr,返回 数组，数组元素就是 用 substr 分隔出来的 富文本 数据
 */
export function richText(str, subStr) {
  let startIndex = str.search(subStr);
  let arr = [];
  if (startIndex === -1) {
    //没找到子字符串
    arr.push(str);
  } else {
    let res = str.substring(0, startIndex);
    if (!isNull(res)) {
      arr.push(res);
    }
    arr.push(subStr);
    res = str.substring(startIndex + subStr.length, str.length);
    if (!isNull(res)) {
      arr.push(res);
    }
  }
  return arr;
}

/**
 * 截取 linkingUrl 信息,linkingUrl 有 web 端的 https://github.com/suanmei/callapp-lib 库唤起，demo 在 https://git.adxliangmei.com/chenweiyu/official-website
 * 项目的h5loadapp分支
 */
export function cutLinkingUrl() {
  if (!gConstant.app.linkingUrl) {
    return null;
  }
  let host = null,
    params = {},
    path = null;
  let arr = gConstant.app.linkingUrl.split('//');
  if (arr.length > 1) {
    host = arr[0];
    let arr1 = arr[1].split('?');
    if (arr1.length > 1) {
      path = arr1[0];
      arr1 = arr1[1].split('&');
      if (arr1.length > 0) {
        arr1.map((value, index, array) => {
          let arrs = value.split('=');
          if (arrs.length > 1) {
            let key = arrs[0],
              values = arrs[1];
            params[key] = values;
          }
        });
      }
    }
  }
  return {
    host,
    /*唤醒哪个app*/ path /*页面*/,
    params /*参数*/,
  };
}

/**
 * 隐藏手机号部分信息
 * @param phone
 */
export function hidePhoneNum(phone) {
  return phone.substring(0, 3) + '****' + phone.substring(7, phone.length);
}

/**
 * 判断字符串emailAddr是否为合法的email格式
 * 主要判断'@'及'.'是否出现，以及两者的位置
 * @param emailAddr 输入的email地址
 * @return true/false。
 */
export function emailCheck(emailAddr) {
  if (emailAddr == null || emailAddr.length < 2) {
    return false;
  }

  // 需出现'@',且不在首字符.
  const aPos = emailAddr.indexOf('@', 1);

  if (aPos < 0) {
    return false;
  }

  // '@'后出现'.',且不紧跟其后.
  if (emailAddr.indexOf('.', aPos + 2) < 0) {
    return false;
  }

  return true;
}

/**
 * 判断 字符串是否 包含 链接
 * @param str_url
 * @returns {boolean}
 */
export function isContainsURL(str_url) {
  const strRegex =
    '((https|http|ftp|rtsp|mms)?://)' +
    "(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
    '(([0-9]{1,3}\\.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+\\.)*" + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\.' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)";
  const re = new RegExp(strRegex);
  return re.test(str_url);
}

/**
 * 解析url参数
 */
// export function parseUrl (url) {
//   let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
//   let r = url.match(reg)
//   return r
// }

/**
 * 解析淘口令里的 http 链接
 * @param text
 */
export function parseUrlFromTaoKouLing(text) {
  // const reg = /([http|https]*?:\/\/m\.tb\.cn\/[(?:s\/){0,1}|(share)]*(?:[0-9a-zA-Z?=&])+)(?:.+:(?:\s)*)?([a-zA-Z]{4})?/;
  const index = text.search('http');
  const url = text.substring(index, index + 35);
  console.log('parseUrlFromTaoKouLing url=', url);
  return url;
}

//解析url  的 scheme, host， path ,params
/**
 * https://xxx.xxx.com:8888/xxx/index.html?key=xxx&xxx=xxx
 * @param url
 * @returns {null|{path: string, host: string, params: string}}
 */
export function parseUrl(url) {
  if (isNull(url)) {
    return null;
  }
  let scheme = 'http: || https:',
    host = 'xxx.xxx.com',
    port = ':xxxx',
    path = '/xxx/xxx',
    params = '?xxx=xxx&xxx=xxx';
  let arr = url.split('//'); //arr=['https:','xxx.xxx.com:8888/xxx/index.html?key=xxx&xxx=xxx']
  if (arr.length > 1) {
    scheme = arr[0]; //http: || https:
    const host_port_path_paramsArr = arr[1].split('?'); //host_port_path_paramsArr=['xxx.xxx.com:8888/xxx/index.html','key=xxx&xxx=xxx']
    const host_port_pathStr = host_port_path_paramsArr[0]; //host_port_pathStr='xxx.xxx.com:8888/xxx/index.html'
    const host_port_pathArr = host_port_pathStr.split('/'); //host_port_pathArr=['xxx.xxx.com:8888','xxx',''index.html]
    const host_portStr = host_port_pathArr[0]; //host_portStr='xxx.xxx.com:8888'
    const host_portArr = host_portStr.split(':');
    host = host_portArr[0];
    port = host_portArr[1];
    params = host_port_path_paramsArr.length > 1 ? host_port_path_paramsArr[1] : '';
  }
  return {
    host,
    /*唤醒哪个app*/ path /*页面*/,
    params /*返回的是str类型的参数，可用getUrlParam拿到具体某个参数的值*/,
  };
}

/**
 * 获取 url 里 指定参数的值
 * @param params ：'?xxx=xxx&xxx=xxx'
 * @param targetP： 要查询 的 指定参数
 */
export function getUrlParam(params, targetP) {
  const reg = new RegExp('(^|&)' + targetP + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
  const r = params.match(reg); //匹配目标参数
  console.log('getUrlParam r=', r);
  if (r != null) {
    return unescape(r[2]);
  }
  return null; //返回参数值
}

/**
 * 删除字符串里的 换行 和 回车 https://www.cnblogs.com/ydam/p/9209185.html
 */
String.prototype.removeLineFeed = function () {
  return this.replace(/[\r\n]/g, '');
};

/**
 * 字符串固定位置插入字符
 * soure为原字符串,start为将要插入字符的位置，newStr为要插入的字符
 * @param soure
 * @param start,从0开始
 * @param newStr
 * @returns {*}
 */
export function insertStr(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start);
}

/**
 * 当前字符串是否是emoji
 * https://blog.csdn.net/FengNext/article/details/106576736
 */
String.prototype.isEmoji = function () {
  let reg = emojiRegex(
    /[\u{1F601}-\u{1F64F}\u{2702}-\u{27B0}\u{1F680}-\u{1F6C0}\u{1F170}-\u{1F251}\u{1F600}-\u{1F636}\u{1F681}-\u{1F6C5}\u{1F30D}-\u{1F567}]/gu
  );
  const res = this.match(reg);

  console.log('stringTools.js ', this, ' 是否是  emoji=', res);
  if (res && res instanceof Array && res.length > 0) {
    return true;
  }
  return false;
};

/**
 * 获取 字符串长度,区分中文和英文
 * 把双字节的替换成两个单字节的然后再获得长度
 * 英文的长度1,中文是2,表情是5,中文标点符号是2,英文标点符号是1
 * @param str
 * @returns {number}
 */
export function getBLen(str) {
  if (str == null) {
    return 0;
  }
  if (typeof str !== 'string') {
    str += '';
  }
  return str.replace(/[^\x00-\xff]/g, '01').length;
}

/**
 * https://www.cnblogs.com/lnlvinso/p/11154093.html
 * 判断字符串是否为JSON格式
 * @param str
 */
export function isJsonStr(str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      console.log('stringTools.js isJsonStr obj=', obj);
      console.log('stringTools.js isJsonStr typeof obj=', typeof obj);
      if ((typeof obj === 'object' && obj) || typeof obj === 'boolean') {
        console.log('stringTools.js isJsonStr str=', str, ' 是json字符串');
        return true;
      } else {
        console.log('stringTools.js isJsonStr str=', str, ' 不是json字符串');
        return false;
      }
    } catch (e) {
      console.log('stringTools.js isJsonStr str=', str, ' 不是json字符串 e=', e);
      return false;
    }
  }
}
