import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document } from '../core/Models/document.model';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'https://localhost:7187/api/Document';

  constructor(private http: HttpClient, private authService: AuthService) {}

  uploadDocument(file: File, title: string): Observable<any> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Title', title);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
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
