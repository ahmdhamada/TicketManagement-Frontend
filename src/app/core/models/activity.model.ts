export type ActivityType = 'Created' | 'StatusChanged' | 'PriorityChanged' | 'AssigneeChanged' | 'CommentAdded' | 'TimeLogged';

export interface TicketActivity {
  id: number;
  ticketId: number;
  actorUserId: number;
  actorName: string;
  type: ActivityType;
  oldValue: string | null;
  newValue: string | null;
  description: string | null;
  createdAtUtc: string;
}
