import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('allows navigation when authenticated', () => {
    const authServiceStub = { isAuthenticated: () => true };

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([]), { provide: AuthService, useValue: authServiceStub }]
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    const authServiceStub = { isAuthenticated: () => false };

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([]), { provide: AuthService, useValue: authServiceStub }]
    });

    const router = TestBed.inject(Router);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toEqual(router.createUrlTree(['/login']));
  });
});
