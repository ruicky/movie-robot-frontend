import solarLunar from 'solarlunar';

export const getToday = () => {
  const today = new Date();
  const solar2lunarData = solarLunar.solar2lunar(today.getFullYear(), today.getMonth()+1, today.getDate());
  const months= ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const month = months[today.getMonth()] + '月';
  const {
    ncWeek: week,
    monthCn,
    cDay:day,
    dayCn,
  } = solar2lunarData;
  const lunar_date = `农历${monthCn}${dayCn}`

  return {
    ...solar2lunarData,
    week,
    month,
    day,
    lunar_date
  }
}
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}