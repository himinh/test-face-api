export function GetDetailCurrentDate() {
  const currentDate = new Date();
  return {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    date: currentDate.getDate(),
    hour: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    milliseconds: currentDate.getMilliseconds(),
  };
}
