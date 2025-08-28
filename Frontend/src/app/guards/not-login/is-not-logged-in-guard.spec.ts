import { TestBed } from '@angular/core/testing';
import { IsNotLoggedInGuard } from './is-not-logged-in-guard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service.ts';

describe('IsNotLoggedInGuard', () => {
  let guard: IsNotLoggedInGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerNavigateSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        IsNotLoggedInGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerNavigateSpy },
      ]
    });

    guard = TestBed.inject(IsNotLoggedInGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block access and redirect if logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});
