import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.checkAuth();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.storage.setToken(response.access_token);
          this.getCurrentUser();
        })
      );
  }

  logout(): void {
    this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe({
      complete: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession();
      }
    });
  }

  getCurrentUser(): void {
    this.http.post<User>(`${this.API_URL}/auth/me`, {}).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.storage.setUser(user);
      },
      error: () => {
        this.clearSession();
      }
    });
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/refresh`, {})
      .pipe(
        tap(response => {
          this.storage.setToken(response.access_token);
        })
      );
  }

  private checkAuth(): void {
    const token = this.storage.getToken();
    const user = this.storage.getUser();

    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  private clearSession(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role?.name === 'admin';
  }
}
