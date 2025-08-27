import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  prefix = 'sched:';
  has = (k: string) => localStorage.getItem(this.prefix + k) !== null;
  get = <T>(k: string, fallback: T): T => {
    const raw = localStorage.getItem(this.prefix + k);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };
  set = <T>(k: string, v: T) => localStorage.setItem(this.prefix + k, JSON.stringify(v));
  del = (k: string) => localStorage.removeItem(this.prefix + k);
}
