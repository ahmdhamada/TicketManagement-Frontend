import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { UserRole } from '../models/enums';

const STORAGE_KEY = 'tms.auth';

interface StoredAuth {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  user: User;
}

/**
 * Holds auth state in memory (signals) and mirrors it to localStorage so a page
 * refresh doesn't log the user out. The access token is short-lived (15 min); the
 * HTTP interceptor uses refreshToken() to transparently rotate it on a 401.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(this.readStored()?.user ?? null);
  private accessToken: string | null = this.readStored()?.accessToken ?? null;
  private refreshTokenValue: string | null = this.readStored()?.refreshToken ?? null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly role = computed<UserRole | null>(() => this.currentUserSignal()?.role ?? null);

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  getAccessToken(): string | null {
    return this.accessToken;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken: this.refreshTokenValue })
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(navigateToLogin = true): void {
    const refreshToken = this.refreshTokenValue;
    this.accessToken = null;
    this.refreshTokenValue = null;
    this.currentUserSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);

    if (refreshToken) {
      // Best-effort revoke; ignore failures since we're logging out regardless.
      this.http.post(`${environment.apiUrl}/auth/revoke`, { refreshToken }).subscribe({ error: () => void 0 });
    }

    if (navigateToLogin) {
      this.router.navigateByUrl('/login');
    }
  }

  private setSession(response: AuthResponse): void {
    this.accessToken = response.accessToken;
    this.refreshTokenValue = response.refreshToken;
    this.currentUserSignal.set(response.user);

    const stored: StoredAuth = {
      accessToken: response.accessToken,
      accessTokenExpiresAtUtc: response.accessTokenExpiresAtUtc,
      refreshToken: response.refreshToken,
      user: response.user
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }

  private readStored(): StoredAuth | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
      return null;
    }
  }
}
