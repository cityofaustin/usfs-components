import { set } from 'lodash';
import { isAfter } from 'date-fns';

// dateString will be either a string in the form "2011-11-11" or undefined
export function parseISODate(dateString) {
  if (typeof dateString === 'string') {
    const [year, month, day] = dateString.split('-', 3);
    return {
      month,
      day,
      year
    }
  }
  return {
    month: '',
    day: '',
    year: '',
  }
}

export function formatISOPartialDate({ month, day, year }) {
  if (month && day && year) {
    return `${formatYear(year)}-${formatDayMonth(month)}-${formatDayMonth(day)}`;
  }

  return undefined;
}

export function formatYear(val) {
  return val;
}

export function formatDayMonth(val) {
  if (val === "") return "";
  val = Number(val);
  if (val) {
    const dayOrMonth = val.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return `0${val}`;
    } else if (Number(dayOrMonth)) {
      return dayOrMonth;
    }
  }
  return '';
}

// Make sure that date is valid. If invalid, plug in approximate date.
// Approximation is made by js Date parser's convention.
// Ex: "02-31-2019" => "03-31-2019"
export function setValidDate(newState) {
  const { year, month, day } = newState.value;
  // A reminder that js Dates start months at index=0 ;)
  const validDate = new Date(year, month-1, day);

  const validYear = validDate.getFullYear();
  const validMonth = validDate.getMonth() + 1;
  const validDay = validDate.getDate();

  if (validMonth !== Number(month)) {
    console.log("oldMonth", month)
    console.log("newMonth", validMonth)
    console.log("formatted newMonth", formatDayMonth(validMonth))
    set(newState, ['value', "month"], formatDayMonth(validMonth));
  }
  if (validDay !== Number(day)) {
    console.log("oldDay", day)
    console.log("newDay", validDay)
    console.log("formatted newDay", formatDayMonth(validDay))
    set(newState, ['value', "day"], formatDayMonth(validDay));
  }

  // If date is in the future, go back to last year
  const isDateInFuture = isAfter(
    new Date(year, newState.value.month-1, newState.value.day),
    new Date(new Date())
  );
  if (isDateInFuture) {
    // Only need to subtract 1 year,
    // Because we do not allow years that are greater than the current year
    set(newState, ['value', "year"], year-1);
  }

  return newState
}
