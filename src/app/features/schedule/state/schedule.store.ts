import { computed, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Course, CourseType } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class ScheduleStore {
  private key = 'schedule:v1';
  courses = signal<Course[]>([]);
  types = signal<CourseType[]>([
    { id: 'obg', label: 'Obrigatória', color: '#22d3ee' },
    { id: 'elt', label: 'Eletiva', color: '#f97316' },
    { id: 'opt', label: 'Optativa', color: '#84cc16' },
    { id: 'cpl', label: 'Complementar', color: '#a78bfa' },
    { id: 'ext', label: 'Extensão', color: '#34d399' },
    { id: 'mon', label: 'Monitoria', color: '#f59e0b' },
    { id: 'out', label: 'Outro', color: '#e879f9' },
  ]);
  constructor(private ls: LocalStorageService) {}
  hydrate(): Promise<boolean> {
    const saved = this.ls.get<{ courses: Course[]; types: CourseType[] }>(this.key, {
      courses: [],
      types: this.types(),
    });
    this.courses.set(saved.courses);
    this.types.set(saved.types);
    return Promise.resolve(true);
  }
  persist() {
    this.ls.set(this.key, { courses: this.courses(), types: this.types() });
  }
  upsertCourse(course: Course) {
    const list = this.courses();
    const i = list.findIndex((c) => c.id === course.id);
    const next = i >= 0 ? [...list.slice(0, i), course, ...list.slice(i + 1)] : [...list, course];
    this.courses.set(next);
    this.persist(); // 👈 salva após editar/drag
  }

  removeCourse(id: string) {
    const list = this.courses();
    this.courses.set(list.filter((c) => c.id !== id));
    this.persist(); // 👈 salva após excluir
  }
  addType(label: string, color: string) {
    const t: CourseType = { id: crypto.randomUUID(), label, color };
    this.types.update((xs) => [...xs, t]);
    this.persist();
    return t;
  }
  usedSlots = computed(() => {
    const map = new Map<string, Set<number>>();
    for (const c of this.courses())
      for (const m of c.meetings) {
        const k = m.day + m.period;
        if (!map.has(k)) map.set(k, new Set<number>());
        m.slots.forEach((s) => map.get(k)!.add(s));
      }
    return map;
  });
  allHoursCompact = computed(() => {
    const set = new Set<number>();
    for (const c of this.courses())
      for (const m of c.meetings) m.slots.forEach((s) => set.add(slotToIndex(m.period, s)));
    return Array.from(set).sort((a, b) => a - b);
  });
}

const slotToIndex = (p: 'M' | 'T' | 'N', s: number) => (p === 'M' ? s : p === 'T' ? 5 + s : 11 + s);
