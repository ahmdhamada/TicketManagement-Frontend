import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TicketService } from '../../../core/services/ticket.service';
import { ALL_PRIORITIES, TicketPriority } from '../../../core/models/enums';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.scss'
})
export class TicketCreate {
  private readonly fb = inject(FormBuilder);

  readonly priorities = ALL_PRIORITIES;
  readonly submitting = signal(false);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(4000)]],
    priority: [TicketPriority.Medium, Validators.required]
  });

  constructor(private readonly ticketService: TicketService, private readonly router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { title, description, priority } = this.form.getRawValue();
    this.ticketService.createTicket({ title: title!, description: description!, priority: priority! }).subscribe({
      next: (ticket) => this.router.navigate(['/tickets', ticket.id]),
      error: () => this.submitting.set(false)
    });
  }
}
