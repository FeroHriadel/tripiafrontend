export function isValidTimeFormat(time: string): boolean {
  const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return pattern.test(time);
}

export function replaceTimeInISO(departureDate: string, departureTime: string) { //expected departureTime format: '07:00'
  if (!isValidTimeFormat(departureTime)) throw new Error('departureTime invalid time format');
  let dateObj = new Date(departureDate);
  const [hours, minutes] = departureTime.split(':').map(Number);
  dateObj.setUTCHours(hours, minutes);
  return dateObj.toISOString();
}

export function getNext14Days() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();  date.setDate(date.getDate() + i);
    let value = date.toISOString(); value = replaceTimeInISO(value, '00:00');
    const label = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    let extraInfo;
    if (i === 0) extraInfo = "today"
    else if (i === 1) extraInfo = "tomorrow"
    else extraInfo = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    days.push({ value, label, extraInfo });
  }
  return days;
}