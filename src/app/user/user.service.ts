import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
// import {axios} from "axios";

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  matricNumber: string;
  mealId?: number; 
  roleId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/v1/auth/curr-user'; // Adjust the base URL accordingly

  constructor(private http: HttpClient) {}

  loadUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found! User might not be logged in.");
      return new Observable(observer => observer.error("No token found"));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl, { headers });
  }
}
