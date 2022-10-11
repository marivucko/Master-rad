import padStart from "lodash.padstart";

const REPER_TIME_HOUR = 20;
const REPER_TIME_MINUTE = 0;

export const getTodayOrTomorrow = () => {
  const today = new Date();
  if (
    today.getHours() > REPER_TIME_HOUR ||
    (today.getHours() === REPER_TIME_HOUR && today.getMinutes() > REPER_TIME_MINUTE)
  ) {
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return fromDateToObjectYMD(tomorrow);
  } else {
    return fromDateToObjectYMD(today);
  }
};

export const showTodayInsteadOfTomorrow = () => {
  const today = new Date();
  if (
    today.getHours() > REPER_TIME_HOUR ||
    (today.getHours() === REPER_TIME_HOUR && today.getMinutes() > REPER_TIME_MINUTE)
  ) {
    return false;
  } else {
    return true;
  }
};

export const getWorkingDaysOfWeekSelectedByDay = (dateObject) => {
  let now = new Date(dateObject.year, dateObject.month - 1, dateObject.day);
  let today = now.getDay();
  let days = [];

  if (today === 6) {
    today = 1;
    now.setDate(now.getDate() + 2);
  } else if (today === 0) {
    today = 1;
    now.setDate(now.getDate() + 1);
  }

  let result;
  let i = 1;
  while (today - i > 0) {
    result = new Date(now);
    result.setDate(now.getDate() - today + i);
    days.push({ year: result.getFullYear(), month: result.getMonth() + 1, day: result.getDate() });
    i++;
  }
  i = 0;
  while (today + i < 6) {
    result = new Date(now);
    result.setDate(now.getDate() + i);
    days.push({ year: result.getFullYear(), month: result.getMonth() + 1, day: result.getDate() });
    i++;
  }
  return days;
};

export const getStringsWorkingDaysOfWeekSelectedByDay = (dateObject, t) => {
  const options = [
    { value: 1, label: t("survey.day.monday") },
    { value: 2, label: t("survey.day.tuesday") },
    { value: 3, label: t("survey.day.wednesday") },
    { value: 4, label: t("survey.day.thursday") },
    { value: 5, label: t("survey.day.friday") },
  ];

  let dateObjects = getWorkingDaysOfWeekSelectedByDay(dateObject);
  let dateStrings = [];
  for (let i = 0; i < dateObjects.length; i++) {
    dateStrings.push(options.at(i).label + " " + dateObjects.at(i).day);
  }
  return dateStrings;
};

export const fromTimeObjectToString = (time) => {
  if (time === undefined || time.hour === undefined || time.minute === undefined) {
    return "";
  }
  return padStart(time.hour, 2, "0") + ":" + padStart(time.minute, 2, "0");
};

export const fromDateToObjectYMD = (date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const fromObjectYMDToDate = (object) => {
  return new Date(object.year, object.month - 1, object.day);
};

export const setToMondayIfWeekendSelected = (object) => {
  let date = new Date(object.year, object.month - 1, object.day);
  if (date.getDay() % 6 === 0) {
    date = new Date(
      object.year,
      object.month - 1,
      object.day + (date.getDay() === 0) * 1 + (date.getDay() === 6) * 2
    );
  }
  return fromDateToObjectYMD(date);
};

export const twoDatesAreSame = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const dateInDatesArray = (date, dates) => {
  let dateInDates = false;
  dates.map((d) => (dateInDates ||= twoDatesAreSame(d, date)));
  return dateInDates;
};
