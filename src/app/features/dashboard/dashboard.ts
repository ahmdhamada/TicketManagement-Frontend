import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { UserRole } from '../../core/models/enums';

const STATUS_COLORS: Record<string, string> = {
  Open: '#0284c7',
  InProgress: '#d97706',
  Resolved: '#16a34a',
  Closed: '#64748b'
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatTableModule, MatIconModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  readonly UserRole = UserRole;
  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(true);

  readonly workloadColumns = ['agentName', 'openCount', 'inProgressCount', 'totalAssigned', 'totalMinutesLogged'];

  statusChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [{ data: [] }] };
  readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
          padding: 16,
          usePointStyle: true
        }
      }
    }
  };

  constructor(private readonly dashboardService: DashboardService, readonly authService: AuthService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.statusChartData = {
          labels: summary.byStatus.map((s) => s.status),
          datasets: [
            {
              data: summary.byStatus.map((s) => s.count),
              backgroundColor: summary.byStatus.map((s) => STATUS_COLORS[s.status] ?? '#94a3b8'),
              borderWidth: 0
            }
          ]
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
