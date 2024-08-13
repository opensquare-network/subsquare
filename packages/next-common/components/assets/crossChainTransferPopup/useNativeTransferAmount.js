import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import { useChainSettings } from "next-common/context/chain";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
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
    return checkTransferAmount({
      transferAmount,
      decimals,
      transferrable,
    });
  }, [transferAmount, transferrable, decimals]);

  return {
    value: transferAmount,
    getCheckedValue,
    component,
  };
}
