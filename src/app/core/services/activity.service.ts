import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TicketActivity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private readonly http: HttpClient) {}

  getTimeline(ticketId: number): Observable<TicketActivity[]> {
    return this.http.get<TicketActivity[]>(`${environment.apiUrl}/tickets/${ticketId}/activities`);
  }
}
