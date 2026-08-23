export interface StatusCount {
  status: string;
  count: number;
}

export interface PriorityCount {
  priority: string;
  count: number;
}

export interface AgentWorkload {
  agentId: number;
  agentName: string;
  openCount: number;
  inProgressCount: number;
  totalAssigned: number;
  totalMinutesLogged: number;
}

export interface DashboardSummary {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  openCriticalTickets: number;
  averageResolutionHours: number;
  byStatus: StatusCount[];
  byPriority: PriorityCount[];
  agentWorkload: AgentWorkload[];
}
