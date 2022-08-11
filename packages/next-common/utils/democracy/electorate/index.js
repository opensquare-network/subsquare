const electorates = {};

export default async function getElectorate(api, height) {
  let blockHeight = height;
  if (!blockHeight) {
    const issuance = await api.query.balances.totalIssuance();
    return issuance.toBigInt().toString()
  }

  if (electorates[blockHeight]) {
    return electorates[blockHeight];
  }

  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const value = await api.query.balances.totalIssuance.at(blockHash);
  electorates[blockHeight] = value;
  return value.toBigInt().toString();
}
