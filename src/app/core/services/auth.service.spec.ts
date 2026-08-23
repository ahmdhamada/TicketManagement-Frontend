import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';
import { UserRole } from '../models/enums';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('starts unauthenticated with no stored session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getAccessToken()).toBeNull();
  });

  it('stores the session and exposes the current user after login', () => {
    service.login({ email: 'admin@invento.sa', password: 'Passw0rd!' }).subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/auth/login'));
    req.flush({
      accessToken: 'token-123',
      accessTokenExpiresAtUtc: new Date().toISOString(),
      refreshToken: 'refresh-123',
      user: { id: 1, fullName: 'Ava Admin', email: 'admin@invento.sa', role: UserRole.Admin, isActive: true, createdAtUtc: new Date().toISOString() }
    });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAccessToken()).toBe('token-123');
    expect(service.currentUser()?.role).toBe(UserRole.Admin);
    expect(localStorage.getItem('tms.auth')).toContain('token-123');
  });

  it('clears session state on logout', () => {
    service.login({ email: 'admin@invento.sa', password: 'Passw0rd!' }).subscribe();
    httpMock.expectOne((r) => r.url.includes('/auth/login')).flush({
      accessToken: 't',
      accessTokenExpiresAtUtc: new Date().toISOString(),
      refreshToken: 'r',
      user: { id: 1, fullName: 'A', email: 'a@a.com', role: UserRole.Customer, isActive: true, createdAtUtc: new Date().toISOString() }
    });

    service.logout(false);
    httpMock.expectOne((r) => r.url.includes('/auth/revoke')).flush({});

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('tms.auth')).toBeNull();
  });
});
