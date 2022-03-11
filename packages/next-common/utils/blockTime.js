function extractBlockTime(extrinsics) {
  const setTimeExtrinsic = extrinsics.find(
    (ex) => ex.method.section === "timestamp" && ex.method.method === "set"
  );
  if (setTimeExtrinsic) {
    const { args } = setTimeExtrinsic.method.toJSON();
    return args.now;
  }
}

export async function getBlockTimeByHeight(api, blockHeight) {
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  const block = await api.rpc.chain.getBlock(blockHash);

  return extractBlockTime(block.block.extrinsics);
}
