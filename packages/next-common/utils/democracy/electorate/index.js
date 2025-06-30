export default async function getElectorate(api) {
  const issuance = await api.query.balances.totalIssuance();
  return issuance.toBigInt().toString();
}
