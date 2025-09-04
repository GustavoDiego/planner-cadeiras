import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CourseConfigStore {
  twelveAsFirst = signal(false);

  toggleTwelveAsFirst() {
    this.twelveAsFirst.set(!this.twelveAsFirst());
  }
}
