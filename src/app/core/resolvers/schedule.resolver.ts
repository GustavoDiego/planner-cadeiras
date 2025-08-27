import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ScheduleStore } from '../../features/schedule/state/schedule.store';

@Injectable({ providedIn: 'root' })
export class ScheduleResolver implements Resolve<boolean> {
  constructor(private store: ScheduleStore) {}
  resolve(): Promise<boolean> {
    return this.store.hydrate();
  }
}
