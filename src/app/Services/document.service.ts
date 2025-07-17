import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Document } from '../core/Models/document.model';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'https://localhost:7187/api/Document';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // uploadDocument(file: File, title: string): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('title', title);
  //   return this.http.post(`${this.apiUrl}/upload`, formData);
  // }

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
  if (file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  if (text) {
    const payload = {
      title: title,
      text: text
    };
    return this.http.post(`${this.apiUrl}/text`, payload); // Angular sends as application/json
  }

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
