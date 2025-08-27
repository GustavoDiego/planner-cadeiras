import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { UiState } from './core/state/ui-state.service';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIcon, ToastContainerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLight = false;
  constructor(public ui: UiState) {}
  ngOnInit(): void {
    const pref = localStorage.getItem('theme');
    if (pref === 'light') {
      document.documentElement.classList.add('theme-light');
      this.isLight = true;
    }
  }
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  toggleTheme(): void {
    this.isLight = !this.isLight;
    document.documentElement.classList.toggle('theme-light', this.isLight);
    localStorage.setItem('theme', this.isLight ? 'light' : 'dark');
  }
}
