import BigNumber from "bignumber.js";
import { useContext } from "react";
import { useApi } from "utils/hooks";
import { StateContext } from "./stateContext";

export default function useDeposit(chain, depositRequired) {
  const api = useApi(chain);
  const { signerBalance } = useContext(StateContext);

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();
  const balanceInsufficient = new BigNumber(signerBalance).lt(deposit);

  return { deposit, balanceInsufficient };
}
