import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { TicketListItem } from '../../../core/models/ticket.model';
import { ALL_PRIORITIES, ALL_STATUSES, TicketPriority, TicketStatus, UserRole } from '../../../core/models/enums';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    StatusBadge,
    PriorityBadge
  ],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.scss'
})
export class TicketList implements OnInit {
  readonly statuses = ALL_STATUSES;
  readonly priorities = ALL_PRIORITIES;
  readonly UserRole = UserRole;

  readonly displayedColumns = ['id', 'title', 'status', 'priority', 'assignedTo', 'createdAt', 'timeSpent'];

  readonly tickets = signal<TicketListItem[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);

  page = 1;
  pageSize = 10;
  statusFilter: TicketStatus | null = null;
  priorityFilter: TicketPriority | null = null;
  search = '';
  sortBy = '-createdAt';

  private readonly searchChanged$ = new Subject<string>();

  constructor(
    private readonly ticketService: TicketService,
    private readonly signalrService: SignalrService,
    readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.searchChanged$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.page = 1;
      this.load();
    });
  }

  ngOnInit(): void {
    this.load();

    this.signalrService.ticketCreated.subscribe(() => this.load());
    this.signalrService.ticketUpdated.subscribe(() => this.load());
  }

  onSearchInput(value: string): void {
    this.search = value;
    this.searchChanged$.next(value);
  }

  onFilterChange(): void {
    this.page = 1;
    this.load();
  }

  resetFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.priorityFilter = null;
    this.page = 1;
    this.load();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortBy = '-createdAt';
    } else {
      this.sortBy = sort.direction === 'desc' ? `-${sort.active}` : sort.active;
    }
    this.load();
  }

  openTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }

  private load(): void {
    this.loading.set(true);
    this.ticketService
      .getTickets({
        page: this.page,
        pageSize: this.pageSize,
        status: this.statusFilter,
        priority: this.priorityFilter,
        search: this.search || null,
        sortBy: this.sortBy
      })
      .subscribe({
        next: (result) => {
          this.tickets.set(result.items);
          this.totalCount.set(result.totalCount);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
