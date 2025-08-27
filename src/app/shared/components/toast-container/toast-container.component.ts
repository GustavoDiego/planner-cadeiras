import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ToastService } from '../../../core/services/toast.service';
import { Toast } from '../../../core/models/toast.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}
  trackToast = (_: number, t: Toast) => t.id;
}
