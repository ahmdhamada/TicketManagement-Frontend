import { TicketPriority, TicketStatus } from './enums';

export interface TicketListItem {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdByName: string;
  assignedToName: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  totalTimeSpentMinutes: number;
}

export interface TicketDetail {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdByUserId: number;
  createdByName: string;
  assignedToUserId: number | null;
  assignedToName: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  resolvedAtUtc: string | null;
  closedAtUtc: string | null;
  totalTimeSpentMinutes: number;
  rowVersion: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface TicketQueryParams {
  page: number;
  pageSize: number;
  status?: TicketStatus | null;
  priority?: TicketPriority | null;
  assignedToUserId?: number | null;
  search?: string | null;
  sortBy?: string | null;
}
