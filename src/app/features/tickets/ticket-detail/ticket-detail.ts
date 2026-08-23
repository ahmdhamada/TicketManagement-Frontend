import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';

import { TicketService } from '../../../core/services/ticket.service';
import { CommentService } from '../../../core/services/comment.service';
import { TimeEntryService } from '../../../core/services/time-entry.service';
import { ActivityService } from '../../../core/services/activity.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { TicketDetail as TicketDetailModel } from '../../../core/models/ticket.model';
import { Comment } from '../../../core/models/comment.model';
import { TimeEntry } from '../../../core/models/time-entry.model';
import { TicketActivity } from '../../../core/models/activity.model';
import { User } from '../../../core/models/user.model';
import { allowedNextStatuses, ALL_PRIORITIES, TicketPriority, TicketStatus, UserRole } from '../../../core/models/enums';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';

type TimelineEntry =
  | { kind: 'comment'; at: string; comment: Comment }
  | { kind: 'activity'; at: string; activity: TicketActivity };

@Component({
  selector: 'app-ticket-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    StatusBadge,
    PriorityBadge
  ],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.scss'
})
export class TicketDetail implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly UserRole = UserRole;
  readonly priorities = ALL_PRIORITIES;

  readonly ticket = signal<TicketDetailModel | null>(null);
  readonly comments = signal<Comment[]>([]);
  readonly activities = signal<TicketActivity[]>([]);
  readonly timeEntries = signal<TimeEntry[]>([]);
  readonly agents = signal<User[]>([]);
  readonly loading = signal(true);
  readonly editingDetails = signal(false);

  readonly timeline = computed<TimelineEntry[]>(() => {
    const commentEntries: TimelineEntry[] = this.comments().map((c) => ({ kind: 'comment', at: c.createdAtUtc, comment: c }));
    const activityEntries: TimelineEntry[] = this.activities().map((a) => ({ kind: 'activity', at: a.createdAtUtc, activity: a }));
    return [...commentEntries, ...activityEntries].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  });

  readonly nextStatuses = computed<TicketStatus[]>(() => {
    const t = this.ticket();
    const role = this.authService.role();
    return t && role ? allowedNextStatuses(t.status, role) : [];
  });

  readonly canEditDetails = computed(() => {
    const t = this.ticket();
    const user = this.authService.currentUser();
    if (!t || !user) return false;
    if (user.role === UserRole.Admin || user.role === UserRole.Agent) return true;
    return t.createdByUserId === user.id && t.status === TicketStatus.Open;
  });

  readonly commentForm = this.fb.group({ body: ['', [Validators.required, Validators.minLength(1)]] });
  readonly timeForm = this.fb.group({
    workDate: [new Date().toISOString().slice(0, 10), Validators.required],
    durationMinutes: [30, [Validators.required, Validators.min(1), Validators.max(1440)]],
    description: ['']
  });
  readonly detailsForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  private ticketId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ticketService: TicketService,
    private readonly commentService: CommentService,
    private readonly timeEntryService: TimeEntryService,
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
    readonly authService: AuthService,
    private readonly signalrService: SignalrService
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();

    if (this.authService.role() === UserRole.Admin) {
      this.userService.getAgents().subscribe((agents) => this.agents.set(agents));
    }

    this.signalrService.ticketUpdated.subscribe((id) => {
      if (id === this.ticketId) this.loadAll();
    });
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      ticket: this.ticketService.getTicket(this.ticketId),
      comments: this.commentService.getComments(this.ticketId),
      activities: this.activityService.getTimeline(this.ticketId),
      time: this.timeEntryService.getForTicket(this.ticketId)
    }).subscribe({
      next: ({ ticket, comments, activities, time }) => {
        this.ticket.set(ticket);
        this.comments.set(comments);
        this.activities.set(activities);
        this.timeEntries.set(time.entries);
        this.detailsForm.setValue({ title: ticket.title, description: ticket.description });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/tickets');
      }
    });
  }

  changeStatus(status: TicketStatus): void {
    const t = this.ticket();
    if (!t) return;
    this.ticketService.updateStatus(t.id, status, t.rowVersion).subscribe(() => this.loadAll());
  }

  changePriority(priority: TicketPriority): void {
    const t = this.ticket();
    if (!t) return;
    this.ticketService.updatePriority(t.id, priority, t.rowVersion).subscribe(() => this.loadAll());
  }

  assignTo(agentId: number | null): void {
    const t = this.ticket();
    if (!t) return;
    this.ticketService.assign(t.id, agentId, t.rowVersion).subscribe(() => this.loadAll());
  }

  startEditingDetails(): void {
    this.editingDetails.set(true);
  }

  saveDetails(): void {
    const t = this.ticket();
    if (!t || this.detailsForm.invalid) return;

    const { title, description } = this.detailsForm.getRawValue();
    this.ticketService.updateDetails(t.id, title!, description!, t.rowVersion).subscribe(() => {
      this.editingDetails.set(false);
      this.loadAll();
    });
  }

  addComment(): void {
    if (this.commentForm.invalid) return;
    const body = this.commentForm.getRawValue().body!;
    this.commentService.addComment(this.ticketId, body).subscribe(() => {
      this.commentForm.reset({ body: '' });
      this.loadAll();
    });
  }

  logTime(): void {
    if (this.timeForm.invalid) return;
    const { workDate, durationMinutes, description } = this.timeForm.getRawValue();
    this.timeEntryService
      .logTime(this.ticketId, { workDate: workDate!, durationMinutes: durationMinutes!, description: description ?? undefined })
      .subscribe(() => {
        this.timeForm.patchValue({ description: '' });
        this.loadAll();
      });
  }

  describeActivity(activity: TicketActivity): string {
    switch (activity.type) {
      case 'Created':
        return 'created the ticket';
      case 'StatusChanged':
        return `changed status from ${activity.oldValue} to ${activity.newValue}`;
      case 'PriorityChanged':
        return `changed priority from ${activity.oldValue} to ${activity.newValue}`;
      case 'AssigneeChanged':
        return `changed assignee`;
      case 'TimeLogged':
        return activity.description ?? 'logged time';
      default:
        return activity.description ?? '';
    }
  }
}
