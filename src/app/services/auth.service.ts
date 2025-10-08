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
  private apiUrl = 'http://localhost:3000'; // Placeholder for future backend
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
    const storedProfile = localStorage.getItem(`defaultProfile_${userId}`);
    return of({ defaultProfile: storedProfile || null });
  }

  saveDefaultProfile(userId: string, profile: string): Observable<{ success: boolean }> {
    console.log(`Saving profile ${profile} for userId: ${userId}`);
    localStorage.setItem(`defaultProfile_${userId}`, profile); // Persist to localStorage
    return of({ success: true });
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