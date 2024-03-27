import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3000/auth';
  private baseUrl = 'http://localhost:3000'
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.isLoggedIn.next(!!token);
  }

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.isLoggedIn.next(true);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials).pipe(
      map((response: any) => {
        const token = response.token;
        localStorage.setItem('token', token);
        this.isLoggedIn.next(true);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn.next(false);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  makeRequest(endpoint: string, method: string, authenticated: boolean, options?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;

    if (authenticated) {
      const token = this.getToken();
      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        options = options || {};
        options.headers = headers;
      } else {
        return throwError('Token not found');
      }
    }

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get(url, options).pipe(catchError(this.handleError));
      case 'post':
        return this.http.post(url, options.body, options).pipe(catchError(this.handleError));
      case 'put':
        return this.http.put(url, options.body, options).pipe(catchError(this.handleError));
      case 'delete':
        return this.http.delete(url, options).pipe(catchError(this.handleError));
      default:
        return throwError('Invalid HTTP method');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}