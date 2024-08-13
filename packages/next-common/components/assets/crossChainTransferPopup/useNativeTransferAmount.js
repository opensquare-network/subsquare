import BigNumber from "bignumber.js";
import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import { useChainSettings } from "next-common/context/chain";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { useCallback, useState } from "react";

export default function useNativeTransferAmount({ api, transferFromAddress }) {
  const { decimals, symbol } = useChainSettings();
  const [transferAmount, setTransferAmount] = useState("");
  const { transferrable, isLoading } = useAccountTransferrable(
    api,
    transferFromAddress,
  );

  const component = (
    <TransferAmount
      transferrable={transferrable}
      decimals={decimals}
      symbol={symbol}
      isLoading={isLoading}
      transferFromAddress={transferFromAddress}
      transferAmount={transferAmount}
      setTransferAmount={setTransferAmount}
    />
  );

  const getCheckedValue = useCallback(() => {
    if (!transferAmount) {
      throw new Error("Please fill the amount");
    }

    const amount = new BigNumber(transferAmount).times(Math.pow(10, decimals));
    if (amount.isNaN() || amount.lte(0) || !amount.isInteger()) {
      throw new Error("Invalid amount");
    }
    if (transferrable && amount.gt(transferrable)) {
      throw new Error("Insufficient balance");
    }

    return amount.toFixed();
  }, [transferAmount, transferrable, decimals]);

  return {
    value: transferAmount,
    getCheckedValue,
    component,
  };
}
