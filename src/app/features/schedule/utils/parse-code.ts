import { Meeting, PeriodKey, WeekDayKey } from '../models/course.model';
import { periodMaxSlot } from './time-utils';

export const parseScheduleCode = (raw: string): Meeting[] => {
  if (!raw) return [];
  const tokens = raw
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  const acc = new Map<string, { day: WeekDayKey; period: PeriodKey; slots: Set<number> }>();

  for (const tk of tokens) {
    const m = tk.match(/^(\d+)([MTN])([1-9]+)$/i);
    if (!m) continue;
    const days = m[1].split('').filter((d) => /[2-7]/.test(d)) as WeekDayKey[];
    const period = m[2].toUpperCase() as PeriodKey;
    const max = periodMaxSlot(period);
    const slots = m[3]
      .split('')
      .map((n) => parseInt(n, 10))
      .filter((n) => n >= 1 && n <= max);
    if (!days.length || !slots.length) continue;

    for (const day of days) {
      const key = `${day}-${period}`;
      const rec = acc.get(key) ?? { day, period, slots: new Set<number>() };
      slots.forEach((s) => rec.slots.add(s));
      acc.set(key, rec);
    }
  }

  return Array.from(acc.values()).map((r) => ({
    day: r.day,
    period: r.period,
    slots: Array.from(r.slots).sort((a, b) => a - b),
  }));
};
