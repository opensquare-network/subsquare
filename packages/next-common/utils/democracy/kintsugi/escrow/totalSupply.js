import { getFinalizedBlockNumber } from "./utils";
import { isNil } from "lodash-es";

export async function getTotalSupply(api, blockNumber) {
  let height = blockNumber;
  if (isNil(height)) {
    height = await getFinalizedBlockNumber(api);
  }

  const totalSupply = await api.rpc.escrow.totalSupply(height);
  return totalSupply?.amount.toString();
}
