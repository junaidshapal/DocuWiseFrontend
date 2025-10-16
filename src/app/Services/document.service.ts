import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, finalize } from 'rxjs';
import { Document } from '../core/Models/document.model';
import { AuthService } from '../core/auth.service';
import { LoadingStateService } from './loading-state.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'https://localhost:7187/api/Document';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private loadingStateService: LoadingStateService
  ) {
    console.log('DocumentService initialized');
  }

//   uploadDocument(title: string, file?: File, text?: string): Observable<any> {
//   const formData = new FormData();
//   formData.append('title', title);

//   if (file) {
//     formData.append('file', file);
//     return this.http.post(`${this.apiUrl}/upload`, formData);
//   }

//   if (text) {
//     formData.append('text', text);
//     return this.http.post(`${this.apiUrl}/text`, formData);
//   }

//   // fallback
//   return new Observable(observer => {
//     observer.error('No file or text provided.');
//   });
// }

uploadDocument(title: string, file?: File, text?: string): Observable<any> {
  console.log('Starting document upload process', { title, hasFile: !!file, hasText: !!text });
  this.loadingStateService.setLoading(true);

  if (file) {
    console.log('Uploading file document:', { fileName: file.name, fileSize: file.size });
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData)
      .pipe(
        finalize(() => {
          console.log('File upload process completed');
          this.loadingStateService.setLoading(false);
        })
      );
  }

  if (text) {
    console.log('Uploading text document', { textLength: text.length });
    const payload = {
      title: title,
      text: text
    };
    return this.http.post(`${this.apiUrl}/text`, payload)
      .pipe(
        finalize(() => {
          console.log('Text upload process completed');
          this.loadingStateService.setLoading(false);
        })
      );
  }

  console.error('Upload failed: No file or text provided');
  this.loadingStateService.setLoading(false);
  return throwError(() => new Error('No file or text provided.'));
}

  getUserDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/user`);
  }

  getDocumentById(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
