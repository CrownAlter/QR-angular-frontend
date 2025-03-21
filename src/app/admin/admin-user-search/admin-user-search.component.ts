import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-admin-user-search',
  standalone: false,
  templateUrl: './admin-user-search.component.html',
  styleUrl: './admin-user-search.component.css'
})
export class AdminUserSearchComponent {
  userId: number | null = null; // Store user ID as a number
  userDetails: any = null; // Stores retrieved user data
  isLoading = false;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:8000/api/v1/user-meal/get-user-meal-by-id';

  constructor(private http: HttpClient) {}

  searchUser() {
    if (!this.userId || this.userId.toString().trim() === '') {
      this.errorMessage = 'Please enter a valid user ID.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.userDetails = null;

    const token = localStorage.getItem('token'); // ✅ Get admin authentication token
    if (!token) {
      this.errorMessage = 'Authentication required. Please log in.';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // ✅ Prepare the user ID as x-www-form-urlencoded data
    const body = new HttpParams().set('id', this.userId.toString());

    this.http.post(this.apiUrl, body.toString(), { headers }).subscribe({
      next: (response) => {
        if (response) {
          this.userDetails = response;
          console.log("User Found:", response);
        } else {
          this.errorMessage = "User not found.";
        }
      },
      error: (err) => {
        console.error("Error fetching user:", err);
        this.errorMessage = err.error?.message || 'User not found or unauthorized access.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  
  
}
