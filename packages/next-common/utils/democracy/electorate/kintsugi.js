import { getTotalSupply } from "../kintsugi/escrow/totalSupply";
import { getFinalizedBlockNumber } from "../kintsugi/escrow/utils";

const electorates = {};

export default async function getKintElectorate(api, height) {
  let blockHeight = height;
  if (!blockHeight) {
    blockHeight = await getFinalizedBlockNumber(api);
  }

  if (electorates[blockHeight]) {
    return electorates[blockHeight];
  }

  const value = await getTotalSupply(api, blockHeight);
  electorates[blockHeight] = value;
  return value;
}
