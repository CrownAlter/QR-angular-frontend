import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QR-Frontend';
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const mainWrapper = document.querySelector('.main-wrapper');

    if (this.sidebarOpen) {
      sidebar?.classList.add('open');
      overlay?.classList.add('active');
      mainWrapper?.classList.add('shifted');
    } else {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('active');
      mainWrapper?.classList.remove('shifted');
    }
  }

  closeSidebar() {
    this.sidebarOpen = false;
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
    document.querySelector('.main-wrapper')?.classList.remove('shifted');
  }

  @HostListener('window:keydown', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.sidebarOpen) {
      this.closeSidebar();
    }
  }

  constructor(public router: Router) {}

  // ✅ Check if the current route is a "public" page (e.g., login or register)
  isPublicPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}
