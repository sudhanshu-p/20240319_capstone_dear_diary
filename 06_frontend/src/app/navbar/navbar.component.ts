import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isMenuOpen: boolean = false

  constructor(private themeService: ThemeService, private router: Router) { }

  toggleTheme(): void {
    this.themeService.toggleDarkTheme()
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  goToPage(page: String) {
    if (page === "login") {
      this.router.navigate(['/login'])
    }
    else {
      this.router.navigate(['/register'])
    }
  }
}
