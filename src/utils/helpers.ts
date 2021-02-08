export const calcTimezone = (date: Date, timezoneOffset: string = '+8') => {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const adjustedDate = new Date(utc + (3600000 * Number(timezoneOffset)));

  return adjustedDate;
}
