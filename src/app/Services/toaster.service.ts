import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() { }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  showSuccess(title: string, message: string, duration: number = 4000): void {
    this.addToast({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration
    });
  }

  showError(title: string, message: string, duration: number = 5000): void {
    this.addToast({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration
    });
  }

  showWarning(title: string, message: string, duration: number = 4000): void {
    this.addToast({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration
    });
  }

  showInfo(title: string, message: string, duration: number = 4000): void {
    this.addToast({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration
    });
  }

  private addToast(toast: ToastMessage): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  clearAll(): void {
    this.toastsSubject.next([]);
  }
}
