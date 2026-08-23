import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Thin wrapper around the SignalR hub connection. Ticket update/create events only
 * carry an id (see TicketHub on the backend) — consumers refetch via the normal
 * REST endpoints, so this never bypasses server-side data isolation.
 */
@Injectable({ providedIn: 'root' })
export class SignalrService implements OnDestroy {
  private connection: signalR.HubConnection | null = null;
  private readonly ticketCreated$ = new Subject<number>();
  private readonly ticketUpdated$ = new Subject<number>();

  readonly ticketCreated = this.ticketCreated$.asObservable();
  readonly ticketUpdated = this.ticketUpdated$.asObservable();

  constructor(private readonly authService: AuthService) {}

  connect(): void {
    if (this.connection) {
      return;
    }

    const token = this.authService.getAccessToken();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, { accessTokenFactory: () => this.authService.getAccessToken() ?? '' })
      .withAutomaticReconnect()
      .build();

    this.connection.on('ticketCreated', (id: number) => this.ticketCreated$.next(id));
    this.connection.on('ticketUpdated', (id: number) => this.ticketUpdated$.next(id));

    if (token) {
      this.connection.start().catch(() => void 0);
    }
  }

  disconnect(): void {
    this.connection?.stop().catch(() => void 0);
    this.connection = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
