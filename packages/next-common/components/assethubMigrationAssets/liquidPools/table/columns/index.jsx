import { colPoolId } from "./poolId";
import { colTokenPair } from "./tokenPair";
import { colReserve } from "./reserve";
import { colTvl } from "./tvl";
import { colPrice } from "./price";
import { colLpFee } from "./lpFee";

export const liquidPoolsColumnsDef = [
  colPoolId,
  colTokenPair,
  colReserve,
  colPrice,
  colLpFee,
  colTvl,
];
