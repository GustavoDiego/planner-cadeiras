import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiState {
  openAddModal = signal(false);
}
