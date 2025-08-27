import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmação';
  @Input() message = 'Tem certeza?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() danger = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onBackdropClick(e: MouseEvent) {
    if (e.target && (e.target as HTMLElement).classList.contains('confirm-backdrop')) {
      this.cancel.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.cancel.emit();
  }
}
