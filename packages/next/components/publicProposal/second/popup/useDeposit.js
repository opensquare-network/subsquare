import BigNumber from "bignumber.js";
import { useContext } from "react";
import { useApi } from "utils/hooks";
import { StatusContext } from "./statusContext";

export default function useDeposit(chain, depositRequired) {
  const api = useApi(chain);
  const { signerBalance } = useContext(StatusContext);

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();

  const balanceInsufficient = !(new BigNumber(signerBalance).gte(deposit));

  return { deposit, balanceInsufficient };
}
