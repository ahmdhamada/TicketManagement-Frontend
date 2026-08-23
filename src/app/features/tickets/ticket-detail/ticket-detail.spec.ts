import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TicketDetail } from './ticket-detail';

describe('TicketDetail', () => {
  let component: TicketDetail;
  let fixture: ComponentFixture<TicketDetail>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetail);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create and issue the expected initial requests', () => {
    expect(component).toBeTruthy();

    const requests = httpMock.match(() => true);
    expect(requests.length).toBeGreaterThan(0);

    requests.forEach((req) => {
      const url = req.request.url;
      if (url.includes('/comments') || url.includes('/activities') || url.includes('/agents')) {
        req.flush([]);
      } else if (url.includes('/time-entries')) {
        req.flush({ ticketId: 1, totalMinutes: 0, entries: [] });
      } else {
        req.flush({
          id: 1,
          title: 'Sample',
          description: 'Sample description',
          status: 'Open',
          priority: 'Low',
          createdByUserId: 1,
          createdByName: 'Cara Customer',
          assignedToUserId: null,
          assignedToName: null,
          createdAtUtc: new Date().toISOString(),
          updatedAtUtc: null,
          resolvedAtUtc: null,
          closedAtUtc: null,
          totalTimeSpentMinutes: 0,
          rowVersion: ''
        });
      }
    });
  });
});
