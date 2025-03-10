import { Component, OnInit } from '@angular/core';
import { UserService} from '../user.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  username: string;
  matricNumber: string;
  mealId?: number;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  userDetails: User | null = null;
  recentScans = [
    { type: 'Breakfast', date: '2025-03-09' },
    { type: 'Lunch', date: '2025-03-08' },
  ]; // Example data

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userService.loadUserDetails().subscribe({
      next: (response) => {
        console.log("User Details:", response);
        this.userDetails = response; // ✅ Assign response to userDetails
      },
      error: (err) => {
        console.error("Error fetching user details:", err);
      }
    });
  }
  
  

  generateQRCode(): void {
    console.log('Generating QR Code...');
    // Logic for QR code generation can be implemented here
  }
}
