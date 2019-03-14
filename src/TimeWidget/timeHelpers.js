// timeString will be either a string in the form "12:30 AM" or undefined
export function parseTime(timeString) {
  if (typeof dateString === 'string') {
    const [hour, minute, period] = dateString.split(/\:|\s/)
    return {
      hour,
      minute,
      period
    }
  }
  return {
    hour: '',
    minute: '',
    period: 'AM',
  }
}

export function formatTime({ hour, minute, period }) {
  if (hour && minute.length && period) {
    return `${formatHourMinute(hour)}:${formatHourMinute(minute)} ${period}`;
  }

  return undefined;
}

export function formatHourMinute(val) {
  if (val || val.length) {
    const hourOrMinute = val.toString();
    if (Number(hourOrMinute) && hourOrMinute.length === 1) {
      return `0${val}`;
    } else if (Number(hourOrMinute)) {
      return hourOrMinute;
    }
  }
  return '';
}
