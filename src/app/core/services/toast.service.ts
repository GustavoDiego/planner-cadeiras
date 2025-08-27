import { Injectable, signal } from '@angular/core';
import { Toast, ToastTone } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _list = signal<Toast[]>([]);

  list(): Toast[] {
    return this._list();
  }

  // overloads
  push(message: string, tone?: ToastTone, ttl?: number): string;
  push(input: { id?: string; message: string; tone?: ToastTone; ttl?: number }): string;
  push(
    arg1: string | { id?: string; message: string; tone?: ToastTone; ttl?: number },
    tone?: ToastTone,
    ttl?: number,
  ): string {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    let message: string;
    let tTone: ToastTone = 'info';
    let tTtl = 4000;

    if (typeof arg1 === 'string') {
      message = arg1;
      if (tone) tTone = tone;
      if (typeof ttl === 'number') tTtl = ttl;
    } else {
      message = arg1.message;
      if (arg1.tone) tTone = arg1.tone;
      if (typeof arg1.ttl === 'number') tTtl = arg1.ttl;
    }

    const item: Toast = { id, message, tone: tTone, ttl: tTtl };
    this._list.update((arr) => [item, ...arr]);
    if (tTtl > 0) window.setTimeout(() => this.dismiss(id), tTtl);
    return id;
  }

  dismiss(id: string): void {
    this._list.update((arr) => arr.filter((t) => t.id !== id));
  }
  clear(): void {
    this._list.set([]);
  }

  info(message: string, ttl?: number) {
    return this.push(message, 'info', ttl);
  }
  success(message: string, ttl?: number) {
    return this.push(message, 'success', ttl);
  }
  warn(message: string, ttl?: number) {
    return this.push(message, 'warn', ttl);
  }
  error(message: string, ttl?: number) {
    return this.push(message, 'error', ttl);
  }
}
