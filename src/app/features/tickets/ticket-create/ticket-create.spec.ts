import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TicketCreate } from './ticket-create';

describe('TicketCreate', () => {
  let component: TicketCreate;
  let fixture: ComponentFixture<TicketCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCreate],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires a title of at least 3 characters', () => {
    component.form.controls.title.setValue('ab');
    expect(component.form.controls.title.invalid).toBe(true);
  });

  it('is valid with well-formed input', () => {
    component.form.setValue({ title: 'Printer broken', description: 'It will not turn on at all', priority: component.priorities[1] });
    expect(component.form.valid).toBe(true);
  });
});
