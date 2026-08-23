import { Component, Input } from '@angular/core';
import { TicketPriority } from '../../../core/models/enums';

@Component({
  selector: 'app-priority-badge',
  imports: [],
  templateUrl: './priority-badge.html',
  styleUrl: './priority-badge.scss'
})
export class PriorityBadge {
  @Input({ required: true }) priority!: TicketPriority;

  get cssClass(): string {
    return `badge badge--${this.priority.toLowerCase()}`;
  }
}
