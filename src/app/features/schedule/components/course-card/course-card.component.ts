import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgIconComponent } from '@ng-icons/core';
import { ScheduleStore } from '../../state/schedule.store';
import { Course } from '../../models/course.model';
import { SLOT_TO_TIME } from '../../utils/time-utils';

type PeriodKey = 'M' | 'T' | 'N';
interface DragData {
  courseId: string;
  from: { day: string; period: PeriodKey; slot: number };
}

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle, NgIconComponent],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() day!: string;
  @Input() hour!: number;
  @Input() twelve = false;

  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() openShare = new EventEmitter<Course>();

  private dragging = false;

  get visible(): boolean {
    return hasAt(this.course, this.day, this.hour, this.twelve);
  }

  store = inject(ScheduleStore);
  get typeColor(): string {
    const t = this.store.types().find((x) => x.id === this.course.typeId);
    return t?.color ?? 'var(--primary)';
  }
  typeLabel = computed(() => {
    const t = this.store.types().find((x) => x.id === this.course.typeId);
    return t?.label ?? '';
  });

  get dragData(): DragData | null {
    for (const m of this.course.meetings) {
      if (m.day !== this.day) continue;
      for (const s of m.slots) {
        const [a] = SLOT_TO_TIME(m.period as PeriodKey, s, this.twelve);
        if (a === this.hour) {
          return {
            courseId: this.course.id,
            from: { day: this.day, period: m.period as PeriodKey, slot: s },
          };
        }
      }
    }
    return null;
  }

  onCardActivate(): void {
    if (!this.dragging) this.openShare.emit(this.course);
  }
  onDragStarted(): void {
    this.dragging = true;
    this.dragStart.emit();
  }
  onDragEnded(): void {
    setTimeout(() => {
      this.dragging = false;
      this.dragEnd.emit();
    }, 0);
  }
}

function hasAt(c: Course, day: string, hour: number, twelve = false): boolean {
  for (const m of c.meetings) {
    if (m.day !== day) continue;
    for (const s of m.slots) {
      const [a] = SLOT_TO_TIME(m.period as PeriodKey, s, twelve);
      if (a === hour) return true;
    }
  }
  return false;
}
