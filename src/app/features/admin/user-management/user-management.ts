import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { UserRole } from '../../../core/models/enums';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagement implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly roles = [UserRole.Admin, UserRole.Agent, UserRole.Customer];
  readonly users = signal<User[]>([]);
  readonly displayedColumns = ['fullName', 'email', 'role', 'isActive', 'actions'];
  readonly showCreateForm = signal(false);

  readonly createForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [UserRole.Agent, Validators.required]
  });

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.userService.getAll().subscribe((users) => this.users.set(users));
  }

  createUser(): void {
    if (this.createForm.invalid) return;
    const { fullName, email, password, role } = this.createForm.getRawValue();
    this.userService.create({ fullName: fullName!, email: email!, password: password!, role: role! }).subscribe(() => {
      this.createForm.reset({ role: UserRole.Agent });
      this.showCreateForm.set(false);
      this.load();
    });
  }

  toggleActive(user: User): void {
    this.userService.update(user.id, { fullName: user.fullName, role: user.role, isActive: !user.isActive }).subscribe(() => this.load());
  }

  changeRole(user: User, role: UserRole): void {
    this.userService.update(user.id, { fullName: user.fullName, role, isActive: user.isActive }).subscribe(() => this.load());
  }
}
