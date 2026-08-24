import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TicketPriority } from '../../../core/models/enums';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './priority-badge.html',
  styleUrl: './priority-badge.scss'
})
export class PriorityBadge {
  @Input({ required: true }) priority!: TicketPriority;

  get cssClass(): string {
    return `priority-badge priority-badge--${this.priority?.toLowerCase()}`;
  }

  get icon(): string {
    switch (this.priority) {
      case TicketPriority.Low:
        return 'arrow_downward';
      case TicketPriority.Medium:
        return 'remove';
      case TicketPriority.High:
        return 'arrow_upward';
      case TicketPriority.Critical:
        return 'warning';
      default:
        return 'label';
    }
  }
}
