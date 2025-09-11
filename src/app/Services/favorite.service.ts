import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

private baseUrl = 'https://localhost:7187/api/Favorites';

  constructor(private http: HttpClient) {}

  addFavorite(docId: number) {
    console.log('[FavoriteService] addFavorite ->', docId);
    return this.http.post(`${this.baseUrl}/${docId}`, {});
  }

  removeFavorite(docId: number) {
    console.log('[FavoriteService] removeFavorite ->', docId);
    return this.http.delete(`${this.baseUrl}/${docId}`);
  }

  getFavorites() {
    console.log('[FavoriteService] getFavorites ->');
    return this.http.get<any[]>(this.baseUrl);
  }

  isFavorite(docId: number) {
    console.log('[FavoriteService] isFavorite ->', docId);
    return this.http.get<boolean>(`${this.baseUrl}/check/${docId}`);
  }
}
