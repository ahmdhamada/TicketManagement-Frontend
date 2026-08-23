import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { UserRole } from '../../core/models/enums';

const STATUS_COLORS: Record<string, string> = {
  Open: '#1e88e5',
  InProgress: '#f9a825',
  Resolved: '#43a047',
  Closed: '#78909c'
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatTableModule, BaseChartDirective],
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
    plugins: { legend: { position: 'bottom' } }
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
              backgroundColor: summary.byStatus.map((s) => STATUS_COLORS[s.status] ?? '#90a4ae')
            }
          ]
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
