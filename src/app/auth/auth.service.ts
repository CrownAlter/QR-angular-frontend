import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://8bde-105-112-204-173.ngrok-free.app//api/v1/auth'; // Adjust this to match your backend URL

  constructor(private http: HttpClient) {}

  // Get the current authenticated user
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');  // Assuming JWT is stored in localStorage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/current-user`, { headers });
  }

  registerUser(userData: any) {
    const formData = new URLSearchParams();
    Object.keys(userData).forEach((key) => formData.append(key, userData[key]));

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(this.apiUrl + '/register', formData.toString(), { headers });
  }
}
