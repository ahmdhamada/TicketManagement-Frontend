export enum UserRole {
  Admin = 'Admin',
  Agent = 'Agent',
  Customer = 'Customer'
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export const ALL_STATUSES: TicketStatus[] = [
  TicketStatus.Open,
  TicketStatus.InProgress,
  TicketStatus.Resolved,
  TicketStatus.Closed
];

export const ALL_PRIORITIES: TicketPriority[] = [
  TicketPriority.Low,
  TicketPriority.Medium,
  TicketPriority.High,
  TicketPriority.Critical
];

/** Mirrors TicketStatusRules on the backend, used only for optimistic UI (server is the source of truth). */
export function allowedNextStatuses(current: TicketStatus, role: UserRole): TicketStatus[] {
  if (role === UserRole.Customer) {
    return current === TicketStatus.Resolved ? [TicketStatus.Closed] : [];
  }

  switch (current) {
    case TicketStatus.Open:
      return [TicketStatus.InProgress, TicketStatus.Closed];
    case TicketStatus.InProgress:
      return [TicketStatus.Resolved, TicketStatus.Open, TicketStatus.Closed];
    case TicketStatus.Resolved:
      return [TicketStatus.Closed, TicketStatus.InProgress];
    case TicketStatus.Closed:
      return [];
    default:
      return [];
  }
}
