import { Component, HostListener, OnInit } from '@angular/core';
import { UserService} from '../user.service';
import { QrGenerationComponent } from '../qr-generation/qr-generation.component';

import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  id: number;
  username: string;
  matricNumber: string;
  mealId?: number;
  mealType: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  userDetails: User | null = null;
  mealHistory: any[] = [];
  mealsLeft: number = 0; // Stores meals left
  mealsUsed: number = 0; // Stores meals used
  showQRCode = false; // Initially hidden
  qrData = ''; // Data for the QR Code
  qrHistory: any;
  mealPlan: string = 'Not assigned'; // ✅ Stores meal plan text
  

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userService.loadUserDetails().subscribe({
      next: (response) => {
        console.log("User Details:", response);
        this.userDetails = response;

        // ✅ Store userId in localStorage for later use
        if (this.userDetails?.id) {
          localStorage.setItem('userId', this.userDetails.id.toString());
          this.loadMealHistory(this.userDetails.id);
          this.loadMealStatus();
        }

        // ✅ Determine meal plan based on mealId
        this.mealPlan = this.getMealPlan(this.userDetails?.mealId);
      },
      error: (err) => {
        console.error("Error fetching user details:", err);
      }
    });
}


  getMealPlan(mealId?: number): string {
    switch (mealId) {
      case 1:
        return 'Breakfast & Lunch';
      case 2:
        return 'Breakfast & Supper';
      case 3:
        return 'Lunch & Supper';
      case 4:
        return 'Breakfast, Lunch & Supper';
      default:
        return 'Not assigned';
    }
  }
  
  toggleQRCode() {
    if (this.userDetails) {
      const now = new Date(); // Get current local time
  
      this.qrData = JSON.stringify({
        id: this.userDetails.id,
        username: this.userDetails.username,
        matricNumber: this.userDetails.matricNumber,
        mealId: this.userDetails.mealId || 'Not assigned',
        timestamp: now.toISOString() // Add timestamp in ISO format
      });
  
      this.showQRCode = !this.showQRCode; // Toggle QR display
    } else {
      console.error("No user details available!");
    }
  }

  loadMealHistory(userId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = `http://localhost:8000/api/v1/meal/history/${userId}`;

    this.http.get(apiUrl, { headers }).subscribe({
      next: (history: any) => {
        console.log("Meal History:", history);
        this.mealHistory = history;
      },
      error: (err) => {
        console.error("Error fetching meal history:", err);
      }
    });
  }

  getLatestMealHistory(): any[] {
    return this.mealHistory.slice(0, 10); // ✅ Show only the latest 10 records
  }
  

  // ✅ Fetch Meals Left & Meals Used
  loadMealStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = `http://localhost:8000/api/v1/user-meal/user-meal-status`;

    this.http.get(apiUrl, { headers }).subscribe({
      next: (mealStatus: any) => {
        console.log("Meal Status:", mealStatus);
        this.mealsLeft = mealStatus.mealsLeft;
        this.mealsUsed = mealStatus.mealsUsed;
      },
      error: (err) => {
        console.error("Error fetching meal status:", err);
      }
    });
  }
}
