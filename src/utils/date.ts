export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getWeekRange(reference: Date) {
  const date = new Date(reference);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = startOfDay(new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff));
  const end = endOfDay(new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6));

  return { start, end };
}

export function getMonthRange(reference: Date) {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start, end };
}

export function parseDateInput(value?: string) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}
