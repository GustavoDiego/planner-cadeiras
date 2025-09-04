import type { PeriodKey } from '../models/course.model';

export const DAY_MAP: Record<string, string> = {
  '2': 'Seg',
  '3': 'Ter',
  '4': 'Qua',
  '5': 'Qui',
  '6': 'Sex',
  '7': 'Sáb',
};
export const PERIOD_LABEL: Record<string, string> = { M: 'Manhã', T: 'Tarde', N: 'Noite' };

export const periodMaxSlot = (p: PeriodKey, twelveAsFirst = false): number =>
  p === 'T' ? (twelveAsFirst ? 6 : 5) : 5;

export const SLOT_TO_TIME = (
  p: PeriodKey,
  s: number,
  twelveAsFirst = false,
): [number, number] => {
  if (p === 'M') return [7 + (s - 1), 8 + (s - 1)];
  if (p === 'T') {
    const start = twelveAsFirst ? 12 : 13;
    return [start + (s - 1), start + s];
  }
  return [18 + (s - 1), 19 + (s - 1)];
};

export const formatHour = (h: number) => String(h).padStart(2, '0') + ':00';
