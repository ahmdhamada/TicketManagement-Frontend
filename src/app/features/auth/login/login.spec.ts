import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks the form invalid when email/password are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('marks the form valid with a well-formed email and password', () => {
    component.form.setValue({ email: 'user@example.com', password: 'Passw0rd!' });
    expect(component.form.valid).toBe(true);
  });

  it('does not submit when the form is invalid', () => {
    component.submit();
    expect(component.loading()).toBe(false);
  });
});
