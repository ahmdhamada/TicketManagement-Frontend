import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { TicketService } from './ticket.service';
import { environment } from '../../../environments/environment';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('builds query params for getTickets', () => {
    service.getTickets({ page: 2, pageSize: 10, status: null, priority: null, search: 'printer', sortBy: '-createdAt' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/tickets`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('search')).toBe('printer');
    req.flush({ items: [], page: 2, pageSize: 10, totalCount: 0, totalPages: 0 });
  });

  it('sends the rowVersion when updating status', () => {
    service.updateStatus(5, 'InProgress' as any, 'AAAA').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tickets/5/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'InProgress', rowVersion: 'AAAA' });
    req.flush({});
  });
});
