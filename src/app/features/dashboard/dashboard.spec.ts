import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
        provideCharts(withDefaultRegisterables())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create and render summary stats once loaded', () => {
    const req = httpMock.expectOne((r) => r.url.includes('/dashboard/summary'));
    req.flush({
      totalTickets: 5,
      openTickets: 2,
      inProgressTickets: 1,
      resolvedTickets: 1,
      closedTickets: 1,
      openCriticalTickets: 1,
      averageResolutionHours: 3.5,
      byStatus: [{ status: 'Open', count: 2 }],
      byPriority: [{ priority: 'High', count: 2 }],
      agentWorkload: []
    });

    fixture.detectChanges();

    expect(component.summary()?.totalTickets).toBe(5);
    expect(component.loading()).toBe(false);
  });
});
