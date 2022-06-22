import solarLunar from 'solarLunar';

export const getToday = () => {
  const today = new Date();
  const solar2lunarData = solarLunar.solar2lunar(today.getFullYear(), today.getMonth()+1, today.getDate());
  console.log(solar2lunarData);
  const {
    ncWeek: week,
    monthCn: month,
    cDay:day,
    dayCn,
  } = solar2lunarData;
  const lunar_date = `农历${month}${dayCn}`

  return {
    ...solar2lunarData,
    week,
    month,
    day,
    lunar_date
  }
}
