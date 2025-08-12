import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import BigNumber from "bignumber.js";

export default function useCheckTransactionFee(address) {
  const dispatch = useDispatch();
  const { value: nativeBalance } = useSubBalanceInfo(address);
  const existentialDeposit = useQueryExistentialDeposit();

  const checkTransactionFee = useCallback(
    async (tx, address) => {
      try {
        const paymentInfo = await tx.paymentInfo(address);
        const estimatedFee = paymentInfo.partialFee.toBigInt();
        const totalRequired = new BigNumber(estimatedFee.toString()).plus(
          existentialDeposit || 0,
        );

        if (nativeBalance && existentialDeposit) {
          const { transferrable } = nativeBalance;

          if (new BigNumber(transferrable).lt(totalRequired)) {
            dispatch(
              newErrorToast(
                "Insufficient native token balance for transaction fees.",
              ),
            );
            return false;
          }
        }

        return true;
      } catch (error) {
        dispatch(newErrorToast("Failed to estimate transaction fee"));
        return false;
      }
    },
    [nativeBalance, existentialDeposit, dispatch],
  );

  return {
    checkTransactionFee,
  };
}
