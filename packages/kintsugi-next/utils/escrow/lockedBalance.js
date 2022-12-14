export async function getLockedBalance(api, address) {
  const result = await api.query.escrow.locked(address);
  const { amount } = result?.toJSON() || {};
  return amount;
}
