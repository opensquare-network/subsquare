import BigNumber from "bignumber.js";
import useApi from "../../../../utils/hooks/useApi";
import isNil from "lodash.isnil";

export default function useDeposit(
  depositRequired,
  signerBalance,
  isBalanceLoaded,
) {
  const api = useApi();

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();

  const isLoading = isNil(deposit) || !isBalanceLoaded;
  const balanceInsufficient = isLoading
    ? false
    : new BigNumber(signerBalance).lt(deposit);

  return { deposit, balanceInsufficient, isLoading };
}
