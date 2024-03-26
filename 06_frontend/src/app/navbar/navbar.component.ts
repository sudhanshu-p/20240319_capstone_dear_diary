import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false
  isLoggedIn: boolean = false

  constructor(private themeService: ThemeService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn
      }
    )
  }

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
    else if (page === "register") {
      this.router.navigate(['/register'])
    }
    else if(page === "editor") {
      this.router.navigate(['/create'])
    }
  }

  logOut() {
    this.authService.logout()
    this.router.navigate([''])
  }
}
