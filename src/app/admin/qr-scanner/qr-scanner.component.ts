import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr-scanner',
  standalone: false,
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent {
  scannedData: any = null; // Holds the scanned QR code data
  allowedFormats = [BarcodeFormat.QR_CODE];
  apiUrl = 'http://localhost:8000/api/v1/meal/consume'; // Change to match your API
  isValidating = false;

  getMealType(timestamp: string): string {
    const date = new Date(timestamp); // Convert timestamp string to Date object
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = hours * 60 + minutes; // Convert to total minutes for easy comparison
  
    console.log(`Extracted Time: ${hours}:${minutes} (${time} minutes)`); // ✅ Log exact time
  
    if (time >= 390 && time <= 600) { // 6:30 AM - 10:00 AM
      console.log("Assigned Meal Type: breakfast"); // ✅ Debug meal type
      return 'breakfast';
    } else if (time >= 720 && time <= 900) { // 12:00 PM - 3:00 PM
      console.log("Assigned Meal Type: lunch");
      return 'lunch';
    } else if (time >= 1020 && time <= 1200) { // 5:00 PM - 8:00 PM
      console.log("Assigned Meal Type: supper");
      return 'supper';
    } else {
      console.log("Assigned Meal Type: invalid (Outside meal hours)");
      return 'lunch'; // Outside meal hours
    }
  }
    

  constructor(private http: HttpClient) {}

  onScanSuccess(qrText: string) {
    try {
      this.scannedData = JSON.parse(qrText); // ✅ Convert string to object
  
      if (this.scannedData.timestamp) {
        this.scannedData.mealType = this.getMealType(this.scannedData.timestamp);
        console.log("Meal Type Assigned:", this.scannedData.mealType); // ✅ Log mealType
      } else {
        console.warn("Timestamp missing in scanned QR code!");
      }
  
      console.log("Scanned QR Data Before Sending:", this.scannedData); // ✅ Log full JSON data
  
      // Example: Access individual values
      console.log("ID:", this.scannedData.userId);
      console.log("Username:", this.scannedData.name);
      console.log("Matric Number:", this.scannedData.matricNumber);
      console.log("Meal ID:", this.scannedData.mealId);
      console.log("Timestamp:", this.scannedData.timestamp);
      
      // Now send it to backend
      this.validateQRCode();
    } catch (error) {
      console.error("Invalid QR Code format!", error);
      alert("Invalid QR Code. Please try again.");
    }
  }
  
  

  validateQRCode() {
    if (!this.scannedData) {
      console.error("No scanned QR data available!");
      return;
    }
  
    this.isValidating = true;
  
    const token = localStorage.getItem('token');
    console.log("Auth Token:", token); // ✅ Debugging
  
    if (!token) {
      console.error("No authentication token found!");
      alert("Authentication required. Please log in.");
      this.isValidating = false;
      return;
    }
  
    // ✅ Extract required fields from scanned QR data
    const { matricNumber, username, mealId, id, timestamp } = this.scannedData;
    const mealType = this.getMealType(timestamp); // Determine meal type
  
    console.log("Meal Type Assigned:", mealType);
  
    // ✅ Prepare x-www-form-urlencoded data
    const body = new HttpParams()
      .set('matricNumber', matricNumber)
      .set('username', username) // Backend expects "name"
      .set('mealType', mealType)
      .set('mealId', mealId.toString()) // Convert mealId to string
      .set('userId', id.toString()); // Convert userId to string
  
    console.log("Final Request Body:", body.toString()); // ✅ Debug request body
  
    // ✅ Set headers for x-www-form-urlencoded
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  
    // ✅ Send the request to the backend
    this.http.post(this.apiUrl, body.toString(), { headers }).subscribe({
      next: (response) => {
        console.log("Validation Success:", response);
        alert("QR Code Validated Successfully!");
      },
      error: (err) => {
        console.error("Validation Failed:", err);
        alert(`Error: ${err.error?.message || "Validation failed!"}`);
      },
      complete: () => {
        this.isValidating = false;
      }
    });
  }
  
  
}
