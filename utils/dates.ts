export function getNext14Days() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const value = date.toISOString();
    const label = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    let extraInfo;
    if (i === 0) extraInfo = "today"
    else if (i === 1) extraInfo = "tomorrow"
    else extraInfo = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    days.push({ value, label, extraInfo });
  }
  return days;
}

export function getTomorrow7Oclock() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(7, 0, 0, 0);
  return tomorrow;
}