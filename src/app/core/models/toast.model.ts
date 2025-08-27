export type ToastTone = 'info' | 'success' | 'warn' | 'error';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
  ttl?: number;
}
