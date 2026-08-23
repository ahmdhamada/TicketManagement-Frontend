import { Component, Input } from '@angular/core';
import { TicketStatus } from '../../../core/models/enums';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss'
})
export class StatusBadge {
  @Input({ required: true }) status!: TicketStatus;

  get cssClass(): string {
    return `badge badge--${this.status.toLowerCase()}`;
  }
}
