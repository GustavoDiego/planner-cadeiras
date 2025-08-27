export const DAY_MAP: Record<string, string> = {
  '2': 'Seg',
  '3': 'Ter',
  '4': 'Qua',
  '5': 'Qui',
  '6': 'Sex',
  '7': 'Sáb',
};
export const PERIOD_LABEL: Record<string, string> = { M: 'Manhã', T: 'Tarde', N: 'Noite' };

export const SLOT_TO_TIME = (p: 'M' | 'T' | 'N', s: number) => {
  if (p === 'M') return [7 + (s - 1), 8 + (s - 1)];
  if (p === 'T') return [12 + (s - 1), 13 + (s - 1)];
  return [18 + (s - 1), 19 + (s - 1)];
};

export const periodMaxSlot = (p: 'M' | 'T' | 'N') => (p === 'T' ? 6 : 5);

export const formatHour = (h: number) => String(h).padStart(2, '0') + ':00';
