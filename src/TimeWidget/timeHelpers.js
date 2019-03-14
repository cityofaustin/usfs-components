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
  if (val === "") return ""
  val = Number(val);
  if (val || (val === 0)) {
    const hourOrMinute = val.toString();
    if (!isNaN(hourOrMinute) && hourOrMinute.length === 1) {
      return `0${val}`;
    } else if (!isNaN(hourOrMinute)) {
      return hourOrMinute;
    }
  }
  return '';
}
