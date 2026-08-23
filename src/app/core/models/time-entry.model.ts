export interface TimeEntry {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  workDate: string;
  durationMinutes: number;
  description: string | null;
  createdAtUtc: string;
}

export interface TicketTimeSummary {
  ticketId: number;
  totalMinutes: number;
  entries: TimeEntry[];
}

export interface CreateTimeEntryRequest {
  workDate: string;
  durationMinutes: number;
  description?: string;
}
