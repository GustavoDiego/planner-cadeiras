import { Component, signal, OnInit, effect, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ScheduleGridComponent } from '../../components/schedule-grid/schedule-grid.component';
import { CourseModalComponent } from '../../components/course-modal/course-modal.component';
import { ExportImageService } from '../../../../core/services/export-image.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CourseShareComponent } from '../../components/course-share/course-share.component';
import type { Meeting as ModelMeeting, WeekDayKey, Course } from '../../models/course.model';
import { ScheduleStore } from '../../state/schedule.store';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { UiState } from '../../../../core/state/ui-state.service';
import { ViewChild } from '@angular/core';
interface CourseLike {
  id?: string;
  name: string;
  teacher?: string;
  description?: string;
  typeId: string;
  meetings: { day: string; period: 'M' | 'T' | 'N'; slots: number[] }[];
}

interface EditPayload {
  id?: string;
  name: string;
  teacher?: string;
  description?: string;
  typeId: string;
  meetings: ModelMeeting[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    ScheduleGridComponent,
    CourseModalComponent,
    CourseShareComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(ScheduleGridComponent) grid!: ScheduleGridComponent;

  exportGrid = async () => {
    const wrap = document.getElementById('grid');
    const content = wrap?.querySelector('.grid') as HTMLElement;
    if (!wrap || !content) return;

    wrap.classList.add('exporting');

    await this.grid?.enableExportMode();

    const prev = {
      wrapOverflow: wrap.style.overflow,
      contentWidth: content.style.width,
      bg: content.style.background,
    };

    try {
      const w = content.scrollWidth;
      wrap.style.overflow = 'visible';
      content.style.width = `${w}px`;

      const computedBg =
        getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#0f1115';
      content.style.background = computedBg.trim();

      await this.exportImg.exportElAsPng(content, 'horarios.png');
      this.toast.success('Imagem de horários exportada.');
    } catch (e) {
      this.toast.push('Falha ao exportar imagem.', 'warn');
      console.error(e);
    } finally {
      content.style.width = prev.contentWidth;
      content.style.background = prev.bg;
      wrap.style.overflow = prev.wrapOverflow;

      this.grid?.disableExportMode();
      wrap.classList.remove('exporting');
    }
  };

  modal = signal(false);
  shareOpen = signal(false);
  shareData = signal<CourseLike | null>(null);
  shareCourse = signal<Course | null>(null);
  editing = signal<EditPayload | null>(null);
  confirmOpen = signal(false);
  confirmData = signal<{ id: string; name: string } | null>(null);
  constructor(
    private exportImg: ExportImageService,
    private toast: ToastService,
    private store: ScheduleStore,
    public ui: UiState,
    private injector: Injector,
  ) {
    effect(
      () => {
        if (this.ui.openAddModal()) {
          this.startNewDraft();
          this.modal.set(true);
          document.body.classList.add('modal-open');
          this.ui.openAddModal.set(false);
        }
      },
      { injector: this.injector },
    );
  }

  ngOnInit() {
    this.store.hydrate();
  }

  private startNewDraft() {
    const defaultType = this.store.types()[0]?.id ?? 'obg';
    this.editing.set({
      name: '',
      teacher: '',
      description: '',
      typeId: defaultType,
      meetings: [],
    });
  }

  openModal() {
    this.modal.set(true);
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.modal.set(false);
    document.body.classList.remove('modal-open');
  }
  confirmDelete = () => {
    const data = this.confirmData();
    if (!data) return;

    if ((this.store as any).removeCourse) {
      (this.store as any).removeCourse(data.id);
      this.toast.success('Disciplina excluída.');
    } else {
      console.warn('Implemente ScheduleStore.removeCourse(id: string)');
      this.toast.push('Não foi possível excluir. Método ausente no Store.', 'warn');
    }

    this.shareOpen.set(false);
    this.shareCourse.set(null);
    this.shareData.set(null);
    this.confirmOpen.set(false);
    this.confirmData.set(null);
  };

  cancelDelete = () => {
    this.confirmOpen.set(false);
    this.confirmData.set(null);
    this.toast.push('Exclusão cancelada.', 'info');
  };

  onAddAt = (e: { day: string; period: 'M' | 'T' | 'N'; slot: number }) => {
    this.editing.set({
      name: '',
      teacher: '',
      description: '',
      typeId: 'obg',
      meetings: [{ day: e.day as any, period: e.period, slots: [e.slot] }],
    } as any);

    this.modal.set(true);
    this.toast?.push('Preencha os dados da nova disciplina.', 'info');
  };

  onEditCourse = (c: Course | CourseLike): void => {
    this.shareOpen.set(false);

    const fromStore =
      'id' in c && c.id ? this.store.courses().find((x: Course) => x.id === c.id) : null;
    const full = fromStore ?? c;

    const meetings: ModelMeeting[] = full.meetings.map((m) => ({
      day: m.day as WeekDayKey,
      period: m.period,
      slots: [...m.slots].sort((a, b) => a - b),
    }));

    this.editing.set({
      id: (full as any).id,
      name: full.name,
      teacher: full.teacher,
      description: full.description,
      typeId: full.typeId,
      meetings,
    });

    this.modal.set(true);
    this.toast.push(`Editando "${full.name}".`, 'info');
  };

  onDeleteCourse = (c: Course | CourseLike): void => {
    if (!('id' in c) || !c.id) {
      this.shareOpen.set(false);
      this.shareCourse.set(null);
      this.shareData.set(null);
      this.toast.push('Rascunho descartado.', 'success');
      return;
    }

    this.confirmData.set({ id: c.id as string, name: c.name || 'Disciplina' });
    this.confirmOpen.set(true);
  };

  openShare = (c: Course): void => {
    this.shareData.set(null);
    this.shareCourse.set(c);
    this.shareOpen.set(true);
    document.body.classList.add('modal-open');
  };

  closeShare = () => {
    this.shareOpen.set(false);
    this.shareCourse.set(null);
    document.body.classList.remove('modal-open');
  };

  openShareDraft = (draft: CourseLike): void => {
    this.shareCourse.set(null);
    this.shareData.set(draft);
    this.shareOpen.set(true);
  };

  downloadShare = async () => {
    const el = document.getElementById('course-share');
    if (!el) return;

    el.classList.add('exporting');
    try {
      await this.exportImg.exportElAsPng(el, 'cadeira.png');
      this.toast.push('Imagem da cadeira exportada.', 'success');
    } catch (e) {
      this.toast.push('Falha ao exportar imagem.', 'warn');
      console.error(e);
    } finally {
      el.classList.remove('exporting');
    }
  };

  exportShare() {
    const el = document.getElementById('course-share');
    if (!el) return;
    this.exportImg.exportElAsPng(el, 'disciplina.png');
    this.toast.success('Imagem da disciplina exportada.');
  }
}
