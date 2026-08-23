import { allowedNextStatuses, TicketStatus, UserRole } from './enums';

describe('allowedNextStatuses', () => {
  it('lets a customer close a resolved ticket', () => {
    expect(allowedNextStatuses(TicketStatus.Resolved, UserRole.Customer)).toEqual([TicketStatus.Closed]);
  });

  it('does not let a customer move an open ticket to in-progress', () => {
    expect(allowedNextStatuses(TicketStatus.Open, UserRole.Customer)).toEqual([]);
  });

  it('lets an agent move an open ticket to in-progress or closed', () => {
    expect(allowedNextStatuses(TicketStatus.Open, UserRole.Agent)).toEqual([TicketStatus.InProgress, TicketStatus.Closed]);
  });

  it('returns nothing for a closed ticket regardless of role', () => {
    expect(allowedNextStatuses(TicketStatus.Closed, UserRole.Admin)).toEqual([]);
  });
});
