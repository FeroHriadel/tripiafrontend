export function isValidTimeFormat(time: string): boolean { //is e.g.: `07:30`?
  const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return pattern.test(time);
}

export function replaceTimeInISO(departureDate: string, departureTime: string) { //expected departureTime format: '07:00'
  if (!isValidTimeFormat(departureTime)) throw new Error('departureTime invalid time format');
  let dateObj = new Date(departureDate);
  const [hours, minutes] = departureTime.split(':').map(Number);
  dateObj.setUTCHours(hours, minutes); dateObj.setUTCSeconds(0); dateObj.setUTCMilliseconds(0);
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

export function isAtLeast4HoursFromNow(selectedDateISO: string, selectedTime: string): boolean {
  const now = new Date();
  const [selectedHours, selectedMinutes] = selectedTime.split(':').map(Number);
  const selectedDate = new Date(selectedDateISO);
  selectedDate.setHours(selectedHours, selectedMinutes, 0, 0);
  const timeDifference = selectedDate.getTime() - now.getTime();
  const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);
  return timeDifferenceInHours >= 4;
}

export function formatUTCToHumanreadable(utcDateString: string): string {
  const date = new Date(utcDateString);
  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-based month, so add 1
  const year = date.getUTCFullYear();
  return `${dayOfWeek}, ${day}.${month} ${year}`;
}

export function formatUTCToDateAndHour(utcString: string): string {
  const date = new Date(utcString);
  const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
  };
  const datePart = new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '');
  const hours = date.getUTCHours().toString().padStart(2, '0'); // Format hours as 2 digits
  const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Format minutes as 2 digits
  
  return `${datePart} at ${hours}:${minutes}`;
}