import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToasterService, ToastMessage } from '../../Services/toaster.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToasterComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.subscription = this.toasterService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string): void {
    this.toasterService.removeToast(id);
  }

  getToastClasses(type: string): string {
    const baseClasses = 'flex items-start p-4 mb-3 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-400 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-400 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-400 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-400 text-gray-800`;
    }
  }

  getIconClasses(type: string): string {
    const baseClasses = 'w-5 h-5 mr-3 mt-0.5 flex-shrink-0';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-400`;
      case 'error':
        return `${baseClasses} text-red-400`;
      case 'warning':
        return `${baseClasses} text-yellow-400`;
      case 'info':
        return `${baseClasses} text-blue-400`;
      default:
        return `${baseClasses} text-gray-400`;
    }
  }

  trackByToastId(index: number, toast: ToastMessage): string {
    return toast.id;
  }
}
