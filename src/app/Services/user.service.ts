import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../core/Models/UserProfileDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl = 'https://localhost:7187/api/UserProfile';
  constructor(private http: HttpClient) { }

  //hitting the endpoints for User Controller
  getProfile() {
  return this.http.get<UserProfile>(`${this.baseUrl}`);
}

updateProfile(data: any) {
  return this.http.put(`${this.baseUrl}/update`, data);
}

changePassword(data: any) {
  return this.http.put(`${this.baseUrl}/change-password`, data, { responseType: 'text' });
}



uploadProfilePicture(formData: FormData) {
  return this.http.post(`${this.baseUrl}/upload-picture`, formData);
}

}
