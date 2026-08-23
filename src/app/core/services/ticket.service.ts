import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import {
  CreateTicketRequest,
  TicketDetail,
  TicketListItem,
  TicketQueryParams
} from '../models/ticket.model';
import { TicketPriority, TicketStatus } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly baseUrl = `${environment.apiUrl}/tickets`;

  constructor(private readonly http: HttpClient) {}

  getTickets(query: TicketQueryParams): Observable<PagedResult<TicketListItem>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    if (query.status) params = params.set('status', query.status);
    if (query.priority) params = params.set('priority', query.priority);
    if (query.assignedToUserId) params = params.set('assignedToUserId', query.assignedToUserId);
    if (query.search) params = params.set('search', query.search);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);

    return this.http.get<PagedResult<TicketListItem>>(this.baseUrl, { params });
  }

  getTicket(id: number): Observable<TicketDetail> {
    return this.http.get<TicketDetail>(`${this.baseUrl}/${id}`);
  }

  createTicket(request: CreateTicketRequest): Observable<TicketDetail> {
    return this.http.post<TicketDetail>(this.baseUrl, request);
  }

  updateDetails(id: number, title: string, description: string, rowVersion: string): Observable<TicketDetail> {
    return this.http.put<TicketDetail>(`${this.baseUrl}/${id}`, { title, description, rowVersion });
  }

  updateStatus(id: number, status: TicketStatus, rowVersion: string): Observable<TicketDetail> {
    return this.http.patch<TicketDetail>(`${this.baseUrl}/${id}/status`, { status, rowVersion });
  }

  updatePriority(id: number, priority: TicketPriority, rowVersion: string): Observable<TicketDetail> {
    return this.http.patch<TicketDetail>(`${this.baseUrl}/${id}/priority`, { priority, rowVersion });
  }

  assign(id: number, assignedToUserId: number | null, rowVersion: string): Observable<TicketDetail> {
    return this.http.patch<TicketDetail>(`${this.baseUrl}/${id}/assign`, { assignedToUserId, rowVersion });
  }
}
