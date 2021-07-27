/**
 * https://www.cnblogs.com/carekee/articles/1678041.html
 */
import *as stringTools from './stringTools'

/**
 2个 date 对象 是否相等
 */
const isEqualDate = (date1, date2) => {
  let date1Data = getDateData(date1)
  let date2Data = getDateData(date2)
  return date1Data.y === date2Data.y && date1Data.m === date2Data.m && date1Data.d === date2Data.d
}

/**
 得到日期 date 对象对应的 年月日时分秒 数据,补0
 */
const getDateData = (date) => {
  let now = date
  let y = now.getFullYear() //年
  let m = now.getMonth() + 1 //月
  let d = now.getDate() //日
  let h = now.getHours() //时
  let mm = now.getMinutes() //分
  let s = now.getSeconds()//秒
  return {
    y,
    m: m < 10 ? `0${m}` : m,
    d: d < 10 ? `0${d}` : d,
    h: h < 10 ? `0${h}` : h,
    mm: mm < 10 ? `0${mm}` : mm,
    s: s < 10 ? `0${s}` : s,
  }
}

/**
 得到日期 date 对象对应的 年月日时分秒 数据，不 补全0
 */
const getDateDataWithoutZero = (date) => {
  let now = date
  let y = now.getFullYear() //年
  let m = now.getMonth() + 1 //月
  let d = now.getDate() //日
  let h = now.getHours() //时
  let mm = now.getMinutes() //分
  let s = now.getSeconds()//秒
  return {
    y,
    m,
    d,
    h,
    mm,
    s,
  }
}

/**
 *比较 2个 getDateDataWithoutZero 返回的 对象的 大小,
 * @param one
 * @param tow
 * true:one >two
 */
const compareTwoDateData = (one, two) => {

  return one.y >= two.t && one.m >= two.m && one.d >= two.d && one.h >= two.h && one.mm > two.mm && one.s > two.s
}

/**
 * 得到时间戳对应的 年月日数据
 * @param timeStamp 毫秒
 * @returns {null}
 */
const getTimestampData = (timeStamp) => {
  if (timeStamp) {
    return getDateData(new Date(timeStamp))
  } else {
    return null
  }
}

/**
 * @param {*} str :''
 */
const allocDate = (str) => {
  return new Date(str)
}

const curentTime = () => {
  let now = new Date()

  let y = now.getFullYear() //年
  let m = now.getMonth() + 1 //月
  let d = now.getDate() //日

  let h = now.getHours() //时
  let mm = now.getMinutes() //分
  return {
    y,
    m,
    d,
    h,
    mm
  }
}

//获取当前时间的 时间戳
const curTimeStamp = () => {
  // console.log('new Date().getTime()=', new Date().getTime())
  // console.log('Date.parse(new Date().toString())=', Date.parse(new Date().toString()))

  // 这个方法
  //   和
  //   Date.parse(new Date().toString())
  //   拿到的
  //   毫秒相差
  //   一点
  // return new Date().getTime()

  return Date.parse(new Date().toString())
}

//一天的 毫秒数
const dayTimeStamp = 24 * 60 * 60 * 1000

/**
 获取当前日期的 前天、昨天、今天、明天、后天的 数据对象
 */
const addDayCount = AddDayCount => {
  let dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) //获取AddDayCount天后的日期
  let y = dd.getFullYear()
  let m = dd.getMonth() + 1 //获取当前月份的日期
  let d = dd.getDate()
  return {
    y,
    m,
    d
  }
}

/**
 求两个时间的天数差 参数 y,m,d 格式为 int 类型
 DateOne:{
  y,m,d
}
 */
const daysBetween = (DateOne, DateTwo) => {
  let clock = ({ y, m, d }) => {
    let res = y + '-'
    if (m > 10) {
      res += '0'
    }
    res += m + '-'
    if (d < 10) {
      res += '0'
    }
    res += d + ' '
    return res
  }

  DateOne = clock(DateOne)
  DateTwo = clock(DateTwo)

  let OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'))
  let OneDay = DateOne.substring(
    DateOne.length,
    DateOne.lastIndexOf('-') + 1
  )
  let OneYear = DateOne.substring(0, DateOne.indexOf('-'))

  let TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'))
  let TwoDay = DateTwo.substring(
    DateTwo.length,
    DateTwo.lastIndexOf('-') + 1
  )
  let TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'))

  let cha =
    (Date.parse(OneYear + '/' + OneMonth + '/' + OneDay) -
      Date.parse(TwoYear + '/' + TwoMonth + '/' + TwoDay)) /
    86400000
  return Math.abs(cha)
}

/**
 str: xx-xx-xx 转成 对象
 */
const splitDateStrToOb = str => {
  if (!str) {
    return null
  }
  let arr = str.split('-') //字符分割
  return {
    y: arr.length > 0 ? Number(arr[0]) : null,
    m: arr.length > 1 ? Number(arr[1]) : null,
    d: arr.length > 2 ? Number(arr[2]) : null
  }
}

/**
 * 时间戳转成 "xxxx-xx-xx" 字符串
 */
const timeStampTo_xxxx_xx_xx = timeStamp => {
  const dateObj = getDateData(new Date(timeStamp));
  console.log(
    "dateTools.js timeStampTo_xxxx_xx_xx timeStamp=",
    timeStamp,
    " dateObj=",
    dateObj
  );
  return `${dateObj.y}-${dateObj.m}-${dateObj.d}`;
};

//+---------------------------------------------------
//| 取得日期数据信息
//| 参数 type 表示数据类型
//|     y 年 m月 d日 w星期 ww周 h时 n分 s秒
// 如果 type==w,return 今天|明天|周一。。。周日
//+---------------------------------------------------
const datePart = (type, myDate) => {
  let partStr = ''
  let Week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  switch (type) {
    case 'y':
      partStr = myDate.getFullYear()
      break
    case 'm':
      partStr = myDate.getMonth() + 1
      break
    case 'd':
      partStr = myDate.getDate()
      break
    case 'w':
      partStr = Week[myDate.getDay()]
      break
    case 'ww':
      partStr = myDate.WeekNumOfYear()
      break
    case 'h':
      partStr = myDate.getHours()
      break
    case 'n':
      partStr = myDate.getMinutes()
      break
    case 's':
      partStr = myDate.getSeconds()
      break
  }
  let now = new Date()
  if (isEqualDate(myDate, now)) {
    partStr = '今天'
  }

  let date1Data = getDateData(now)
  let date2Data = getDateData(myDate)
  if (daysBetween({
    y: date1Data.y, m: date1Data.m, d: date1Data.d
  }, {
    y: date2Data.y, m: date2Data.m, d: date2Data.d
  }) == 1) {
    partStr = '明天'
  }
  return partStr
}

/**
 * 计算2个时间 相差的 时间
 * @param {*} startTime 可以为 毫秒级别的时间戳 | "2019-05-24 16:43:10"类型的时间字符串 等等
 * @param {*} endTime 同上
 */
const intervalTime = (startTime, endTime) => {
  let date1 = new Date(startTime)  //开始时间
  let date2 = new Date(endTime)    //结束时间
  let date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
  //计算出相差天数
  let days = Math.floor(date3 / (24 * 3600 * 1000))
  //计算出小时数
  let leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000)
  return {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
    milliseconds: date3//相差的 毫秒时间戳
  }
}

/**
 * 一个毫秒时间戳 转成 是 xx 天 xx 时 xx 分 xx 秒
 * @param {*} timeStamp  毫秒时间戳
 */
const formatTimeStamp = function (timeStamp) {
  let days = parseInt(timeStamp / (1000 * 60 * 60 * 24))
  let hours = parseInt((timeStamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = parseInt((timeStamp % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = parseInt((timeStamp % (1000 * 60)) / 1000)
  return {
    d: days, h: hours, m: minutes, s: seconds
  }
}

//计算 传入的 结束时间的 时间戳 和当前时间 相差的 时间数据
const getLeftStamp = (endDateTimeStamp = 1562830622000) => {
  // let endDateTimeStamp = Date.parse(new Date(endTimeStamp).toString()) //结束时间的 时间戳
  let nowDateTimeStamp = Date.parse(new Date().toString()) //当前时间的 时间戳
  // console.log('endDateTimeStamp=', endDateTimeStamp, ' nowDateTimeStamp=', nowDateTimeStamp)

  let diff = (endDateTimeStamp - nowDateTimeStamp) / 1000
  // console.log('剩余的时间=', diff)

  if (diff <= 0) {
    return null
  }

  const timeLeft = {
    y: 0,
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  }

  if (diff >= (365.25 * 86400)) {
    timeLeft.y = Math.floor(diff / (365.25 * 86400))
    diff -= timeLeft.y * 365.25 * 86400
  }
  if (diff >= 86400) {
    timeLeft.d = Math.floor(diff / 86400)
    diff -= timeLeft.d * 86400
  }
  if (diff >= 3600) {
    timeLeft.h = Math.floor(diff / 3600)
    diff -= timeLeft.h * 3600
  }
  if (diff >= 60) {
    timeLeft.m = Math.floor(diff / 60)
    diff -= timeLeft.m * 60
  }
  timeLeft.s = diff
  return timeLeft
}

/**
 * 根据传进来的 时间数据和 分隔符，返回一个 时间字符串，如 xxxx.xx.xx ,月和日都是 自动前边补0
 */
const formatDateObjToString = ({
                                 y, m, d, str
                               }) => {
  if (!y || !m || !d) {
    return null
  }
  if (typeof m == 'string') {
    m = Number(m)
  }
  if (typeof d == 'string') {
    d = Number(d)
  }
  let mm = m

  if (m < 10) {
    mm = `0${m}`
  }
  let dd = d
  if (d < 10) {
    dd = `0${d}`
  }
  return `${y}` + str + `${mm}` + str + `${dd}`
}

/**
 * 毫秒转成 xx:xx:xx (小时:分:秒)
 * @param msd
 * @returns {string}
 */
const millisecondToDate = (msd) => {
  let time = parseFloat(msd) / 1000 //秒
  if (null != time && '' != time) {
    if (time > 60 && time < 60 * 60) {// 1分-1小时
      let min = parseInt(time / 60.0)//分
      if (min < 10) {
        min = `0${min}`
      }
      let s = parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60)
      if (s < 10) {
        s = `0${s}`
      }
      time = min + ':' + s
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {//1小时-1天
      let h = parseInt(time / 3600.0) //小时
      if (h < 10) {
        h = `0${h}`
      }
      let min = parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) //分
      if (min < 10) {
        min = `0${min}`
      }
      //秒
      let s = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60)
      if (s < 10) {
        s = `0${s}`
      }
      time = h + ':' + min + ':' + s

    } else {//<1分
      if (time < 10) {
        time = `00:0${parseInt(time)}`
      } else {
        time = `00:${parseInt(time)}`
      }
    }
  }
  return time
}

/**
 * 时间显示格式化
 * @param timestamp
 * @returns {string}
 */
const timeFormat = function (timestamp = this.getTime()) {
  let current = new Date().getTime()
  let diffTime = current - timestamp

  let timeSecond = parseInt(diffTime / 1000)
  let timeMinute = parseInt(timeSecond / 60)
  let timeHour = parseInt(timeMinute / 60)
  let timeDay = parseInt(timeHour / 24)
  let timeMonth = parseInt(timeDay / 30)
  let timeYear = parseInt(timeMonth / 12)

  let date = new Date(timestamp)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month < 10 ? `0${month}` : month
  let day = date.getDate()
  day = day < 10 ? `0${day}` : day
  let h = date.getHours().toString()
  let m = date.getMinutes().toString()
  let s = date.getSeconds().toString()
  h = h.length == 1 ? '0' + h : h
  m = m.length == 1 ? '0' + m : m
  s = s.length == 1 ? '0' + s : s

  if (timeYear >= 1) {   //大于一年
    return year + '-' + month + '-' + day
  } else if (timeMonth >= 1) {    //大于一个月
    return month + '-' + day + ' ' + h + ':' + m
  } else if (timeDay >= 1) { //大于一天
    return month + '-' + day + ' ' + h + ':' + m
  } else if (timeHour >= 1) {
    return `${timeHour}小时前`
  } else if (timeMinute >= 1) {
    return `${timeMinute}分钟前`
  } else {
    return `刚刚`
  }
}

/**
 * 把  https://github.com/OvalMoney/react-native-fitness  库返回的 时间 字符串(2020-11-05T02:00:00Z)转成 接口需要的 时间字符串 (2020-08-21 09:00:00)
 * https://www.cnblogs.com/sanyekui/p/13204062.html
 * need_h_mm_s 是否需要 时分秒
 * @type {string}
 */
const formatFitnessDateStrToApiDateStr = (str, need_h_mm_s = true) => {
  if (stringTools.isNull(str)) {
    console.log("dateTools.js formatFitnessDateStrToApiDateStr str=null");
    return "";
  }
  // 数字补0操作
  const addZero = num => {
    return num < 10 ? "0" + num : num;
  };

  var arr = str.split("T");
  var d = arr[0];
  var darr = d.split("-");

  var t = arr[1];
  var tarr = t.split(".000");
  var marr = tarr[0].split(":");

  var dd =
    parseInt(darr[0]) +
    "-" +
    addZero(parseInt(darr[1])) +
    "-" +
    addZero(parseInt(darr[2]));
  if (need_h_mm_s) {
    dd +=
      " " +
      addZero(parseInt(marr[0])) +
      ":" +
      addZero(parseInt(marr[1])) +
      ":" +
      addZero(parseInt(marr[2]));
  }
  // console.log('formatFitnessDateStrToDate dd=', dd)
  return dd;
};

/**
 * Date 对象转成 "Wed Sep 02 2020" 格式对象
 * @param date
 * @returns {string}
 */
const formatTo_enDate = date => {
  const arr = date.toDateString().split(" ");
  return {
    en_day_of_the_week: arr[0],
    en_month: arr[1],
    day: arr[2],
    y: arr[3]
  };
};

/**
 * Convert the string with the date format '2018-09-10 08:00:00' into a Date object
 */
const convert_xxxx_xx_xx_toDate = str => {
  if (!str) {
    return new Date();
  }
  let _str = str;
  _str = _str.replace(/-/g, "/");
  return new Date(_str);
};

/**
 * 'xxx-xx-xx' to timestamp
 */
const xxxx_xx_xx_to_timestamp = xxxx_xx_xx => {
  const date = convert_xxxx_xx_xx_toDate(xxxx_xx_xx);
  const timestamp = date.getTime();
  console.log(
    "dateTools.js xxxx_xx_xx_to_timestamp xxxx_xx_xx=",
    xxxx_xx_xx,
    " timestamp=",
    timestamp
  );
  return timestamp;
};

/**
 * https://blog.csdn.net/pengpengzhou/article/details/104774480
 * How many timestamp does the UTC time differ from the current time zone
 * @returns {number}
 * @constructor
 */
const UTC_local_offset = () => {
  const minutes = new Date().getTimezoneOffset();
  const timeStamp = minutes * 60 * 1000;
  console.log("dateTools.js UTC - local offset(timeStamp):" + timeStamp);
  return timeStamp * -1;
};

/**
 * monday:{y: xxxx, m: xx, d: xx}
 * sunday:{y: xxxx, m: xx, d: xx}
 */
const getMondayAndSunday = () => {
  const day = new Date().getDay();
  console.log("dateTools.js day=", day);
  const monday = dateTools.addDayCount((day - 1) * -1);
  console.log("dateTools.js monday=", monday);
  const sunday = dateTools.addDayCount(7 - day);
  console.log("dateTools.js sunday=", sunday);
  return {
    monday,
    sunday
  };
};

/**
 *  [0-6]correspond['日', '一', '二', '三', '四', '五', '六'] According to local time, return the day of the week in a specific date, 0  means Sunday
 */
const getDay = () => {
  const day = new Date().getDay();
  console.log("dateTools.js getDay day=", day);
  return day;
};

const english_month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

//现在 外部声明，这些方法 才能互相调用
const dateTools = {
  isEqualDate, getTimestampData, timeFormat,
  getDateData, formatDateObjToString,
  curentTime, millisecondToDate,
  addDayCount, curTimeStamp,
  daysBetween, getDateDataWithoutZero,
  splitDateStrToOb, compareTwoDateData,
  datePart, allocDate, dayTimeStamp,
  intervalTime, formatTimeStamp, getLeftStamp,timeStampTo_xxxx_xx_xx,formatFitnessDateStrToApiDateStr,formatTo_enDate,convert_xxxx_xx_xx_toDate,xxxx_xx_xx_to_timestamp,UTC_local_offset,getMondayAndSunday,getDay
}

export default dateTools
