import { Component, OnInit } from '@angular/core';
import { UserService} from '../user.service';
import { QrGenerationComponent } from '../qr-generation/qr-generation.component';

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
  showQRCode = false; // Initially hidden
  qrData = ''; // Data for the QR Code

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
  
  toggleQRCode() {
    if (this.userDetails) {
      const now = new Date(); // Get current local time
  
      this.qrData = JSON.stringify({
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
  
}
