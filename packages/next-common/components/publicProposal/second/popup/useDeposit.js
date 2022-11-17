import React from "react";
import BigNumber from "bignumber.js";
import { useContext } from "react";
import useApi from "../../../../utils/hooks/useApi";
import { StateContext } from "./stateContext";
import isNil from "lodash.isnil";

export default function useDeposit(depositRequired) {
  const api = useApi();
  const { signerBalance } = useContext(StateContext);

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();
  const balanceInsufficient =
    isNil(deposit) || new BigNumber(signerBalance).lt(deposit);

  return { deposit, balanceInsufficient };
}
