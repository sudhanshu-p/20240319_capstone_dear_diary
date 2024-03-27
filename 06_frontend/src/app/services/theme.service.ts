import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private static readonly THEME_KEY = 'isDarkTheme';

  constructor() {
    const isDarkTheme = localStorage.getItem(ThemeService.THEME_KEY) === 'true';
    this.setDarkTheme(isDarkTheme);
  }

  isDarkTheme(): boolean {
    return localStorage.getItem(ThemeService.THEME_KEY) === 'true';
  }

  toggleDarkTheme(): void {
    this.setDarkTheme(!this.isDarkTheme());
  }

  private setDarkTheme(isDarkTheme: boolean): void {
    localStorage.setItem(ThemeService.THEME_KEY, isDarkTheme.toString());
    this.applyTheme(isDarkTheme);
  }

  private applyTheme(isDarkTheme: boolean): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(isDarkTheme ? 'dark-theme' : 'light-theme');
  }
}