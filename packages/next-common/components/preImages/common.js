export function convertTicket(ticket) {
  if (!ticket) {
    return null;
  }
  return {
    amount: ticket.amount.toNumber(),
    who: ticket.who.toString(),
  };
}
