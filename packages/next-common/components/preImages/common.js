export function convertTicket(ticket) {
  if (!ticket) {
    return null;
  }
  return {
    amount: ticket[1].toNumber(),
    who: ticket[0].toString(),
  };
}
