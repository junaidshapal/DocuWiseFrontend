import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

private baseUrl = 'https://localhost:7187/api/Favorites';

  constructor(private http: HttpClient) {}

  addFavorite(docId: number) {
    return this.http.post(`${this.baseUrl}/${docId}`, {});
  }

  removeFavorite(docId: number) {
    return this.http.delete(`${this.baseUrl}/${docId}`);
  }

  getFavorites() {
    return this.http.get<any[]>(this.baseUrl);
  }

  isFavorite(docId: number) {
    return this.http.get<boolean>(`${this.baseUrl}/check/${docId}`);
  }
}
