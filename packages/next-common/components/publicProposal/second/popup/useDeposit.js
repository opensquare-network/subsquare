import BigNumber from "bignumber.js";
import isNil from "lodash.isnil";
import { useContextApi } from "next-common/context/api";

export default function useDeposit(
  depositRequired,
  signerBalance,
  isBalanceLoaded,
) {
  const api = useContextApi();

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();

  const isLoading = isNil(deposit) || !isBalanceLoaded;
  const balanceInsufficient = isLoading
    ? false
    : new BigNumber(signerBalance).lt(deposit);

  return { deposit, balanceInsufficient, isLoading };
}
