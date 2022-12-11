export default async function fetchInactive(api, height) {
  if (!api.query.balances.inactiveIssuance) {
    return 0;
  }

  let blockHeight = height;
  if (!blockHeight) {
    const issuance = await api.query.balances.inactiveIssuance();
    return issuance.toBigInt().toString();
  }

  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  try {
    const value = await api.query.balances.inactiveIssuance.at(blockHash);
    return value.toBigInt().toString();
  } catch (e) {
    return 0;
  }
}
