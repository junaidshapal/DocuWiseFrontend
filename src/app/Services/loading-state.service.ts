import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor() {
    console.log('LoadingStateService initialized');
  }

  setLoading(loading: boolean) {
    console.log(`Setting loading state to: ${loading}`);
    this.isLoadingSubject.next(loading);
  }
}