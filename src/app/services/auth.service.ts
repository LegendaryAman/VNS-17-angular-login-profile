import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Replace with your backend base URL
  private token: string | null = localStorage.getItem('token');

  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<{ userId: string; success: boolean }> {
    console.log(`Login attempt with email: ${email}, password: ${password}`);
    return this.http.post<{ userId: string; success: boolean }>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      catchError(() => of({ userId: '', success: false }))
    );
  }

  getDefaultProfile(userId: string): Observable<{ defaultProfile?: string | null }> {
    console.log(`Fetching default profile for userId: ${userId}`);
    return this.http.get<{ defaultProfile?: string | null }>(`${this.apiUrl}/users/${userId}/default-profile`).pipe(
      catchError(() => of({ defaultProfile: null }))
    );
  }

  saveDefaultProfile(userId: string, profile: string): Observable<{ success: boolean }> {
    console.log(`Saving profile ${profile} for userId: ${userId}`);
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/users/${userId}/default-profile`, { profile }).pipe(
      catchError(() => of({ success: false }))
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}