import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTimeEntryRequest, TicketTimeSummary, TimeEntry } from '../models/time-entry.model';

@Injectable({ providedIn: 'root' })
export class TimeEntryService {
  constructor(private readonly http: HttpClient) {}

  getForTicket(ticketId: number): Observable<TicketTimeSummary> {
    return this.http.get<TicketTimeSummary>(`${environment.apiUrl}/tickets/${ticketId}/time-entries`);
  }

  logTime(ticketId: number, request: CreateTimeEntryRequest): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${environment.apiUrl}/tickets/${ticketId}/time-entries`, request);
  }
}
