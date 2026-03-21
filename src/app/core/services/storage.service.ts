import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  setToken(token: string, remember: boolean = true): void {
    if (this.isBrowser) {
      if (remember) {
        localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.removeItem(this.TOKEN_KEY);
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY) ?? sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }

  setUser(user: any): void {
    if (this.isBrowser) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): any {
    if (this.isBrowser) {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  removeUser(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
}
