export type WeekDayKey = '2' | '3' | '4' | '5' | '6' | '7';
export type PeriodKey = 'M' | 'T' | 'N';

export interface CourseType {
  id: string;
  label: string;
  color: string;
}

export interface Meeting {
  day: WeekDayKey;
  period: PeriodKey;
  slots: number[];
}

export interface Course {
  id: string;
  name: string;
  teacher?: string;
  typeId: string;
  description?: string;
  meetings: Meeting[];
}
