import React from "react";
import BigNumber from "bignumber.js";
import useApi from "../../../../utils/hooks/useApi";
import isNil from "lodash.isnil";

export default function useDeposit(depositRequired, signerBalance) {
  const api = useApi();

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();
  const balanceInsufficient =
    isNil(deposit) || new BigNumber(signerBalance).lt(deposit);

  return { deposit, balanceInsufficient };
}
