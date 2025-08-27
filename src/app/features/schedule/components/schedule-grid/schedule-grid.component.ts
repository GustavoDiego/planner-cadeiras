import {
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  HostListener,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropListGroup, CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ScheduleStore } from '../../state/schedule.store';
import { Course } from '../../models/course.model';
import { DAY_MAP, SLOT_TO_TIME, formatHour } from '../../utils/time-utils';
import { CourseCardComponent } from '../course-card/course-card.component';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
type PeriodKey = 'M' | 'T' | 'N';
interface Row {
  period: PeriodKey;
  hStart: number;
  hEnd: number;
  label: string;
}
interface DragData {
  courseId: string;
  from: { day: string; period: PeriodKey; slot: number };
}
interface DropCell {
  day: string;
  period: PeriodKey;
  slot: number;
}

@Component({
  selector: 'app-schedule-grid',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CourseCardComponent,
    CdkDrag,
    ScrollingModule,
  ],
  templateUrl: './schedule-grid.component.html',
  styleUrls: ['./schedule-grid.component.scss'],
})
export class ScheduleGridComponent implements AfterViewInit, OnDestroy {
  @Output() openShare = new EventEmitter<Course>();
  @Output() addAt = new EventEmitter<{ day: string; period: PeriodKey; slot: number }>();
  @ViewChild('wrap', { static: true }) wrap!: ElementRef<HTMLDivElement>;
  onDragMove(event: CdkDragMove<any>) {
    const el = this.wrap.nativeElement;
    const { x, y } = event.pointerPosition;
    const rect = el.getBoundingClientRect();

    const EDGE = 64; // zona de ativação na borda
    const MAX_STEP = 28; // px por frame (auto)

    // Vertical
    const topDist = y - rect.top;
    const botDist = rect.bottom - y;
    if (topDist < EDGE) {
      el.scrollTop -= Math.ceil(((EDGE - topDist) / EDGE) * MAX_STEP);
    } else if (botDist < EDGE) {
      el.scrollTop += Math.ceil(((EDGE - botDist) / EDGE) * MAX_STEP);
    }

    // Horizontal
    const leftDist = x - rect.left;
    const rightDist = rect.right - x;
    if (leftDist < EDGE) {
      el.scrollLeft -= Math.ceil(((EDGE - leftDist) / EDGE) * MAX_STEP);
    } else if (rightDist < EDGE) {
      el.scrollLeft += Math.ceil(((EDGE - rightDist) / EDGE) * MAX_STEP);
    }
  }

  @ViewChildren(CdkDropList) lists!: QueryList<CdkDropList>;
  connectedTo: (CdkDropList | string)[] = [];
  private ro?: ResizeObserver;
  private mo?: MutationObserver;
  private syncTimeoutId?: number;
  alwaysAllow = () => true;
  days: string[] = ['2', '3', '4', '5', '6', '7'];
  periods: PeriodKey[] = ['M', 'T', 'N'];
  open = signal<Record<PeriodKey, boolean>>({ M: true, T: true, N: true });
  isDragging = signal(false);
  private prevOpen?: Record<PeriodKey, boolean> | null = null;
  activeHours = computed(() => usedHoursByPeriod(this.store.courses()));
  rowsAll = computed(() => baseline());
  rowsUI = computed(() => baseline());
  enterAlways = (_drag: CdkDrag<unknown>, _drop: CdkDropList<unknown>) => true;
  constructor(
    public store: ScheduleStore,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      const map = hasCoursesByPeriod(this.store.courses());
      const hasAny = map.M || map.T || map.N;
      if (hasAny) this.open.set(map);

      this.debouncedSyncRowHeights();
    });
  }
  private exportMode = signal(false);

  /** baseline na UI; compact na exportação */
  rowsView = computed(() => (this.exportMode() ? compact(this.store.courses()) : baseline()));

  /** Faz TODAS as células de uma mesma linha terem a MESMA altura (máxima) */
  private lockHeightsAll(): void {
    const root = this.wrap?.nativeElement;
    if (!root) return;

    // limpa antes de medir
    root
      .querySelectorAll<HTMLElement>('.timecell[data-p][data-i], .slotcell[data-p][data-i]')
      .forEach((el) => {
        el.style.height = '';
        el.style.minHeight = '';
      });

    for (const period of this.periods) {
      const timeRows = Array.from(
        root.querySelectorAll<HTMLElement>(`.timecell[data-role="time"][data-p="${period}"]`),
      );

      for (let i = 0; i < timeRows.length; i++) {
        const timeCell = timeRows[i];
        const slotCells = Array.from(
          root.querySelectorAll<HTMLElement>(
            `.slotcell[data-role="slot"][data-p="${period}"][data-i="${i}"]`,
          ),
        );

        if (!slotCells.length) continue;

        // força reflow para garantir medidas naturais
        void timeCell.offsetHeight;

        const cells = [timeCell, ...slotCells];
        const max = Math.max(...cells.map((c) => c.getBoundingClientRect().height), 80);
        const h = `${Math.ceil(max)}px`;

        // aplica a mesma altura em TODAS as colunas para essa linha
        cells.forEach((c) => {
          c.style.height = h;
          c.style.minHeight = h;
        });
      }
    }
  }

  private unlockHeightsAll(): void {
    const root = this.wrap?.nativeElement;
    if (!root) return;
    root
      .querySelectorAll<HTMLElement>('.timecell[data-p][data-i], .slotcell[data-p][data-i]')
      .forEach((el) => {
        el.style.height = '';
        el.style.minHeight = '';
      });
  }

  /** Chamados pela HomePage */
  async enableExportMode() {
    this.exportMode.set(true);
    this.cdr.detectChanges();
    // aguarda 2 frames para Angular renderizar/compactar linhas
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    this.lockHeightsAll();
  }
  disableExportMode() {
    this.unlockHeightsAll();
    this.exportMode.set(false);
    this.cdr.detectChanges();
    // opcional: re-sincroniza para a UI normal
    requestAnimationFrame(() => this.syncRowHeights());
  }
  rowsByPeriod = computed(() => buildRowsByPeriod(this.store.courses()));

  isHourActive(_p: PeriodKey, _hStart: number): boolean {
    return true; // <- TODOS os horários sempre ativos
  }

  onSlotClick(d: string, p: PeriodKey, hStart: number, ev: MouseEvent) {
    if (this.isDragging()) return;
    const el = ev.target as HTMLElement;
    if (el.closest('app-course-card')) return;

    const slot = this.hourToSlot(p, hStart);

    const hasCard = this.store
      .courses()
      .some((c) =>
        (c.meetings ?? []).some(
          (m) => m.day === d && m.period === p && (m.slots ?? []).includes(slot),
        ),
      );
    if (hasCard) return;

    this.addAt.emit({ day: d, period: p, slot });
  }
  hasCourseAt(d: string, p: PeriodKey, hStart: number): boolean {
    const slot = this.hourToSlot(p, hStart);
    return this.store
      .courses()
      .some((c) =>
        (c.meetings ?? []).some(
          (m) => m.day === d && m.period === p && (m.slots ?? []).includes(slot),
        ),
      );
  }

  onAnyDragStart() {
    if (this.isDragging()) return;
    this.isDragging.set(true);
    this.prevOpen = this.open();
    this.open.set({ M: true, T: true, N: true });
    this.cdr.detectChanges();
    this.connectedTo = this.lists.toArray();
  }

  onAnyDragEnd() {
    this.isDragging.set(false);
    if (this.prevOpen) {
      this.open.set(this.prevOpen);
    }
    this.prevOpen = null;
  }
  isOpen(p: PeriodKey) {
    return this.open()[p];
  }

  onToggle(p: PeriodKey) {
    this.open.update((x) => ({ ...x, [p]: !x[p] }));
    // Aguarda o DOM atualizar completamente antes de sincronizar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.syncRowHeights());
    });
  }

  dayLabel(d: string) {
    return DAY_MAP[d] ?? d;
  }
  periodLabel(p: PeriodKey) {
    return p === 'M' ? 'Manhã' : p === 'T' ? 'Tarde' : 'Noite';
  }

  trackPeriod = (_: number, p: PeriodKey) => p;
  trackRow = (_: number, r: Row) => `${r.period}-${r.hStart}`;
  trackDay = (_: number, d: string) => d;
  trackCourse = (_: number, c: Course) => c.id;

  hourToSlot(p: PeriodKey, hStart: number): number {
    const max = p === 'T' ? 6 : 5;
    for (let n = 1; n <= max; n++) {
      const [a] = SLOT_TO_TIME(p, n);
      if (a === hStart) return n;
    }
    return 1;
  }

  onDrop(e: CdkDragDrop<any>): void {
    const target = e.container?.data as DropCell | undefined;
    const drag = e.item?.data as DragData | undefined;
    if (!target || !drag) return;

    const { courseId, from } = drag;
    const to = target;
    if (from.day === to.day && from.period === to.period && from.slot === to.slot) return;

    const course = this.store.courses().find((c) => c.id === courseId);
    if (!course) return;

    const updated = {
      ...course,
      meetings: course.meetings.map((m) => ({ ...m, slots: [...m.slots] })),
    };

    // Remove slot de origem
    const fromIdx = updated.meetings.findIndex(
      (m) => m.day === from.day && m.period === from.period,
    );
    if (fromIdx >= 0) {
      const m = updated.meetings[fromIdx];
      m.slots = m.slots.filter((s) => s !== from.slot);
      if (!m.slots.length) updated.meetings.splice(fromIdx, 1);
    }

    // Adiciona slot no destino
    const toIdx = updated.meetings.findIndex((m) => m.day === to.day && m.period === to.period);
    if (toIdx >= 0) {
      const m = updated.meetings[toIdx];
      if (!m.slots.includes(to.slot)) m.slots.push(to.slot);
      m.slots.sort((a, b) => a - b);
    } else {
      updated.meetings.push({ day: to.day as any, period: to.period, slots: [to.slot] });
    }

    this.store.upsertCourse(updated);
    this.debouncedSyncRowHeights();
  }

  /* --------- Sincronização de altura melhorada --------- */
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // ResizeObserver para mudanças no container
      this.ro = new ResizeObserver(() => {
        this.debouncedSyncRowHeights();
      });
      this.ro.observe(this.wrap.nativeElement);

      // MutationObserver para mudanças de conteúdo
      this.mo = new MutationObserver((mutations) => {
        // Verifica se houve mudanças relevantes (cards adicionados/removidos)
        const hasRelevantChanges = mutations.some(
          (mutation) =>
            mutation.type === 'childList' ||
            (mutation.type === 'attributes' &&
              ['data-p', 'data-i', 'class'].includes(mutation.attributeName || '')),
        );

        if (hasRelevantChanges) {
          this.debouncedSyncRowHeights();
        }
      });

      this.mo.observe(this.wrap.nativeElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-p', 'data-i', 'class'],
      });
    });
    this.connectedTo = this.lists.toArray();
    this.lists.changes.subscribe(() => {
      this.connectedTo = this.lists.toArray(); // mantém conectado ao mudar o DOM
    });
    // Primeira sincronização após render inicial
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.syncRowHeights());
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.debouncedSyncRowHeights();
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.mo?.disconnect();
    if (this.syncTimeoutId) {
      clearTimeout(this.syncTimeoutId);
    }
  }

  private debouncedSyncRowHeights(): void {
    if (this.syncTimeoutId) {
      clearTimeout(this.syncTimeoutId);
    }

    this.syncTimeoutId = window.setTimeout(() => {
      this.syncRowHeights();
    }, 16); // ~1 frame
  }

  private syncRowHeights(): void {
    const root = this.wrap?.nativeElement;
    if (!root) return;

    // Reset todas as alturas previamente impostas
    const allCells = root.querySelectorAll<HTMLElement>(
      '.slotcell[data-p][data-i], .timecell[data-p][data-i]',
    );
    allCells.forEach((el) => {
      el.style.minHeight = '';
      el.style.height = '';
    });

    // Para cada período e linha, sincronizar alturas
    for (const period of this.periods) {
      if (!this.isOpen(period)) continue;

      // Busca todas as linhas deste período usando a coluna de tempo como referência
      const timeRows = Array.from(
        root.querySelectorAll<HTMLElement>(`.timecell[data-role="time"][data-p="${period}"]`),
      );

      for (let rowIndex = 0; rowIndex < timeRows.length; rowIndex++) {
        const timeCell = timeRows[rowIndex];

        // Busca todos os slots desta linha
        const slotCells = Array.from(
          root.querySelectorAll<HTMLElement>(
            `.slotcell[data-role="slot"][data-p="${period}"][data-i="${rowIndex}"]`,
          ),
        );

        if (!slotCells.length) continue;

        // Permite que o conteúdo defina sua altura natural primeiro
        requestAnimationFrame(() => {
          // Mede as alturas naturais após o render
          const timeCellHeight = this.getElementHeight(timeCell);
          const slotHeights = slotCells.map((el) => this.getElementHeight(el));

          // Calcula a altura máxima necessária
          const maxHeight = Math.max(
            timeCellHeight,
            ...slotHeights,
            80, // Altura mínima padrão
          );

          // Aplica a altura sincronizada
          const finalHeight = `${Math.ceil(maxHeight)}px`;
          timeCell.style.minHeight = finalHeight;
          slotCells.forEach((el) => (el.style.minHeight = finalHeight));
        });
      }
    }
  }

  private getElementHeight(element: HTMLElement): number {
    // Usa getBoundingClientRect para altura com conteúdo
    const rect = element.getBoundingClientRect();
    return rect.height;
  }
}

/* ---- Helpers iguais aos anteriores ---- */
function hr(period: PeriodKey, h: number): Row {
  return { period, hStart: h, hEnd: h + 1, label: `${formatHour(h)}–${formatHour(h + 1)}` };
}

function baseline(): Record<PeriodKey, Row[]> {
  return {
    M: Array.from({ length: 5 }, (_, i) => hr('M', 7 + i)),
    T: Array.from({ length: 6 }, (_, i) => hr('T', 12 + i)),
    N: Array.from({ length: 5 }, (_, i) => hr('N', 18 + i)),
  };
}

function compact(courses: Course[]): Record<PeriodKey, Row[]> {
  const usedM = new Set<number>(),
    usedT = new Set<number>(),
    usedN = new Set<number>();
  for (const c of courses) {
    for (const m of c.meetings ?? []) {
      for (const s of m.slots ?? []) {
        const [a] = SLOT_TO_TIME(m.period, s);
        if (m.period === 'M') usedM.add(a);
        else if (m.period === 'T') usedT.add(a);
        else usedN.add(a);
      }
    }
  }

  if (!usedM.size && !usedT.size && !usedN.size) return baseline();

  return {
    M: [...usedM].sort((a, b) => a - b).map((h) => hr('M', h)),
    T: [...usedT].sort((a, b) => a - b).map((h) => hr('T', h)),
    N: [...usedN].sort((a, b) => a - b).map((h) => hr('N', h)),
  };
}

function buildRowsByPeriod(courses: Course[]) {
  let hasAnySlot = false;
  for (const c of courses) {
    for (const m of c.meetings ?? []) {
      if (m.slots?.length) {
        hasAnySlot = true;
        break;
      }
    }
    if (hasAnySlot) break;
  }

  if (!hasAnySlot) return baseline();
  return compact(courses);
}

function hasCoursesByPeriod(courses: Course[]) {
  const map: Record<PeriodKey, boolean> = { M: false, T: false, N: false };
  for (const c of courses) {
    for (const m of c.meetings ?? []) {
      if (m.slots?.length) map[m.period] = true;
    }
  }
  return map;
}
function usedHoursByPeriod(courses: Course[]): Record<PeriodKey, Set<number>> {
  const M = new Set<number>(),
    T = new Set<number>(),
    N = new Set<number>();
  for (const c of courses) {
    for (const m of c.meetings ?? []) {
      for (const s of m.slots ?? []) {
        const [h] = SLOT_TO_TIME(m.period, s);
        if (m.period === 'M') M.add(h);
        else if (m.period === 'T') T.add(h);
        else N.add(h);
      }
    }
  }
  return { M, T, N };
}
