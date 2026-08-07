import { colPoolId } from "./poolId";
import { colTokenPair } from "./tokenPair";
import { colAccount } from "./account";
import { colReserve } from "./reserve";
import { colTvl } from "./tvl";
import { colPrice } from "./price";

export const liquidPoolsColumnsDef = [
  colPoolId,
  colTokenPair,
  colAccount,
  colReserve,
  colPrice,
  colTvl,
];
