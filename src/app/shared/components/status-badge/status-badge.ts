import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TicketStatus } from '../../../core/models/enums';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss'
})
export class StatusBadge {
  @Input({ required: true }) status!: TicketStatus;

  get cssClass(): string {
    return `status-badge status-badge--${this.status?.toLowerCase()}`;
  }

  get icon(): string {
    switch (this.status) {
      case TicketStatus.Open:
        return 'radio_button_unchecked';
      case TicketStatus.InProgress:
        return 'sync';
      case TicketStatus.Resolved:
        return 'check_circle';
      case TicketStatus.Closed:
        return 'task_alt';
      default:
        return 'info';
    }
  }
}
