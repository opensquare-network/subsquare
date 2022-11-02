export async function getBlockHeightFromHash(api, blockHash) {
  const block = await api.rpc.chain.getBlock(blockHash);
  const targetHeight = block.block.header.number.toNumber();
  return targetHeight;
}
