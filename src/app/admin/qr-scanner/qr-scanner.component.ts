import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  apiUrl = 'http://localhost:8000/api/v1/validate-qr'; // Change to match your API
  isValidating = false;

  constructor(private http: HttpClient) {}

  onScanSuccess(qrText: string) {
    try {
      this.scannedData = JSON.parse(qrText); // ✅ Convert string to object
      console.log("Scanned QR Data:", this.scannedData);
  
      // Example: Access individual values
      console.log("Username:", this.scannedData.username);
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
    if (!this.scannedData) return;
    
    this.isValidating = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(this.apiUrl, this.scannedData, { headers }).subscribe({
      next: (response) => {
        console.log("Validation Success:", response);
        alert("QR Code Validated Successfully!");
      },
      error: (err) => {
        console.error("Validation Failed:", err);
        alert("Invalid QR Code or Unauthorized Access!");
      },
      complete: () => {
        this.isValidating = false;
      }
    });
  }
}
