import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  signal,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleStore } from '../../state/schedule.store';
import { DAY_MAP, SLOT_TO_TIME, formatHour, periodMaxSlot } from '../../utils/time-utils';
import { parseScheduleCode } from '../../utils/parse-code';
import { NgIcon } from '@ng-icons/core';

import type { Meeting as ModelMeeting, WeekDayKey } from '../../models/course.model';
import { ToastService } from '../../../../core/services/toast.service';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CourseConfigStore } from '../../state/course-config.store';
type Period = 'M' | 'T' | 'N';
type Meeting = ModelMeeting;

@Component({
  selector: 'app-course-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.scss'],
})
export class CourseModalComponent implements OnChanges {
  visible = false;
  @Input() set open(value: boolean | string | null | undefined) {
    this.visible = coerceBooleanProperty(value);
  }
  @Input() id: string | null = null;
  @Input() initial: {
    id?: string;
    name: string;
    teacher?: string;
    description?: string;
    typeId: string;
    meetings: Meeting[];
  } | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<{
    id?: string;
    name: string;
    teacher?: string;
    description?: string;
    typeId: string;
    meetings: Meeting[];
  }>();

  name = '';
  teacher = '';
  description = '';
  typeId = 'obg';
  code = '';

  selPeriod = signal<Period>('M');
  selDay = signal<WeekDayKey | null>(null);
  selSlots = new Set<number>();
  manual: Meeting[] = [];
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
  constructor(
    public store: ScheduleStore,
    private toast: ToastService,
    public config: CourseConfigStore,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['open'] && this.visible) || changes['initial']) {
      if (this.initial) this.loadFromInitial(this.initial);
    }
  }

  private loadFromInitial(src: {
    id?: string;
    name: string;
    teacher?: string;
    description?: string;
    typeId: string;
    meetings: Meeting[];
  }) {
    this.id = src.id ?? null;
    this.name = src.name ?? '';
    this.teacher = src.teacher ?? '';
    this.description = src.description ?? '';
    this.typeId = src.typeId ?? 'obg';
    this.code = '';
    this.manual = (src.meetings ?? []).map((m) => ({
      day: m.day,
      period: m.period,
      slots: [...m.slots].sort((a, b) => a - b),
    }));
    this.selDay.set(null);
    this.selSlots.clear();
    this.selPeriod.set('M');
  }

  hourRange(p: Period, slot: number): string {
    const twelve = this.config.twelveAsFirst();
    const [start, end] = SLOT_TO_TIME(p, slot, twelve);
    return `${formatHour(start)}–${formatHour(end)}`;
  }

  slotOptions = computed(() => {
    const p = this.selPeriod();
    const twelve = this.config.twelveAsFirst();
    const max = periodMaxSlot(p, twelve);
    return Array.from({ length: max }, (_, i) => {
      const n = i + 1;
      const [start, end] = SLOT_TO_TIME(p, n, twelve);
      return { n, label: `${formatHour(start)}–${formatHour(end)}` };
    });
  });

  dayLabel(d: WeekDayKey | string) {
    return DAY_MAP[d as WeekDayKey] ?? d;
  }

  selectDay(d: WeekDayKey) {
    this.selDay.set(this.selDay() === d ? null : d);
  }

  private pendingFromUI(): Meeting[] {
    const day = this.selDay();
    if (!day || !this.selSlots.size) return [];
    const slots = Array.from(this.selSlots).sort((a, b) => a - b);
    const period = this.selPeriod();
    return [{ day, period, slots }];
  }

  toggleSlot(n: number) {
    if (this.selSlots.has(n)) this.selSlots.delete(n);
    else this.selSlots.add(n);
  }

  clearCurrent() {
    this.selDay.set(null);
    this.selSlots.clear();
  }

  addBlock(): void {
    const day = this.selDay();
    if (!day || !this.selSlots.size) {
      this.toast.push('Escolha 1 dia e 1 ou mais horários para adicionar um bloco.', 'warn');
      return;
    }
    const slots = Array.from(this.selSlots).sort((a, b) => a - b);
    this.upsertMeeting({ day, period: this.selPeriod(), slots });
    this.clearCurrent();
    this.toast.push('Bloco adicionado.', 'success');
  }

  removeBlock(m: Meeting) {
    this.manual = this.manual.filter((x) => !(x.day === m.day && x.period === m.period));
  }

  private upsertMeeting(m: Meeting) {
    const found = this.manual.find((x) => x.day === m.day && x.period === m.period);
    if (!found) {
      this.manual = [...this.manual, { ...m }];
      return;
    }
    const merged = Array.from(new Set([...found.slots, ...m.slots])).sort((a, b) => a - b);
    found.slots = merged;
    this.manual = [...this.manual];
  }
  private fromCode(): Meeting[] {
    const raw = this.code?.trim();
    if (!raw) return [];
    return parseScheduleCode(raw, this.config.twelveAsFirst());
  }

  private mergeMeetings(a: Meeting[], b: Meeting[]): Meeting[] {
    const key = (m: Meeting) => `${m.day}-${m.period}`;
    const map = new Map<string, Meeting>();
    for (const m of [...a, ...b]) {
      const k = key(m);
      const prev = map.get(k);
      if (!prev) {
        map.set(k, { day: m.day, period: m.period, slots: [...m.slots].sort((x, y) => x - y) });
      } else {
        prev.slots = Array.from(new Set([...prev.slots, ...m.slots])).sort((x, y) => x - y);
      }
    }
    return Array.from(map.values());
  }
  private resetForm() {
    this.id = null;
    this.name = '';
    this.teacher = '';
    this.description = '';
    this.typeId = 'obg';
    this.code = '';
    this.manual = [];
    this.selDay.set(null);
    this.selSlots.clear();
    this.selPeriod.set('M');
  }
  get saveDisabledReason(): string {
    if (!this.name?.trim()) return 'Informe o nome da disciplina.';
    if (!(this.manual.length || (this.selDay() && this.selSlots.size) || this.code?.trim())) {
      return 'Adicione 1 bloco ou insira um código válido.';
    }
    return '';
  }
  get canSave(): boolean {
    const hasName = !!this.name?.trim();
    const hasManual = this.manual.length > 0;
    const hasInline = !!(this.selDay() && this.selSlots.size);
    const hasCode = !!this.code?.trim();
    return hasName && (hasManual || hasInline || hasCode);
  }
  save(): void {
    if (!this.name?.trim()) {
      this.toast.push('Informe o nome da disciplina antes de salvar.', 'warn');
      const el = this.nameInput?.nativeElement;
      if (el) {
        el.focus();
        el.classList.remove('shake');

        void el.offsetWidth;
        el.classList.add('shake');
      }
      return;
    }

    const meetings = this.mergeMeetings([...this.manual, ...this.pendingFromUI()], this.fromCode());
    if (!meetings.length) {
      this.toast.push('Selecione ao menos um horário (ou informe um código válido).', 'warn');
      return;
    }

    if (!this.id) this.id = crypto.randomUUID();
    this.store.upsertCourse({
      id: this.id!,
      name: this.name.trim(),
      teacher: this.teacher || undefined,
      description: this.description || undefined,
      typeId: this.typeId,
      meetings,
    });

    this.toast.push('Disciplina salva com sucesso.', 'success');
    this.close.emit();
    this.resetForm();
  }

  onDownload(): void {
    const meetings = this.mergeMeetings([...this.manual, ...this.pendingFromUI()], this.fromCode());
    const draft = {
      id: this.id ?? undefined,
      name: this.name || 'Disciplina',
      teacher: this.teacher || undefined,
      description: this.description || undefined,
      typeId: this.typeId,
      meetings,
    };
    this.download.emit(draft);
  }
}
