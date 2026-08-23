export interface Comment {
  id: number;
  ticketId: number;
  authorUserId: number;
  authorName: string;
  body: string;
  createdAtUtc: string;
}
