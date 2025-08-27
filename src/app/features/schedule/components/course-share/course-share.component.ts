import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ScheduleStore } from '../../state/schedule.store';
import { DAY_MAP, SLOT_TO_TIME, formatHour } from '../../utils/time-utils';
import { Course } from '../../models/course.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
interface Meeting {
  day: string;
  period: 'M' | 'T' | 'N';
  slots: number[];
}
interface CourseLike {
  id?: string;
  name: string;
  teacher?: string;
  description?: string;
  typeId: string;
  meetings: Meeting[];
}

@Component({
  selector: 'app-course-share',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './course-share.component.html',
  styleUrls: ['./course-share.component.scss'],
})
export class CourseShareComponent {
  @Input() open = false;
  @Input({ required: true }) data!: Course | CourseLike;
  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Course | CourseLike>();
  @Output() delete = new EventEmitter<Course | CourseLike>();

  constructor(public store: ScheduleStore) {}

  typeColor = computed(() => {
    const t = this.store.types().find((x) => x.id === this.data?.typeId);
    return t?.color ?? '#7c3aed';
  });

  typeLabel = computed(() => {
    const t = this.store.types().find((x) => x.id === this.data?.typeId);
    return t?.label ?? '';
  });

  chips = computed(() => {
    if (!this.data?.meetings?.length) return [] as { day: string; ranges: string[] }[];
    return this.data.meetings.map((m) => ({
      day: DAY_MAP[m.day] ?? m.day,
      ranges: slotsToRanges(m.period, m.slots),
    }));
  });
}

function slotsToRanges(period: 'M' | 'T' | 'N', slots: number[]): string[] {
  if (!slots?.length) return [];
  const arr = Array.from(new Set(slots)).sort((a, b) => a - b);
  const ranges: [number, number][] = [];
  let start = arr[0],
    prev = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const s = arr[i];
    if (s === prev + 1) prev = s;
    else {
      ranges.push([start, prev]);
      start = prev = s;
    }
  }
  ranges.push([start, prev]);
  return ranges.map(([aSlot, bSlot]) => {
    const [aStart] = SLOT_TO_TIME(period, aSlot);
    const [, bEnd] = SLOT_TO_TIME(period, bSlot);
    return `${formatHour(aStart)}–${formatHour(bEnd)}`;
  });
}
