import React from "react";
import BigNumber from "bignumber.js";
import { useContext } from "react";
import useApi from "../../../../utils/hooks/useSelectedEnpointApi";
import { StateContext } from "./stateContext";
import isNil from "lodash.isnil";

export default function useDeposit(chain, depositRequired) {
  const api = useApi(chain);
  const { signerBalance } = useContext(StateContext);

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();
  const balanceInsufficient = isNil(deposit) || new BigNumber(signerBalance).lt(deposit);

  return { deposit, balanceInsufficient };
}
