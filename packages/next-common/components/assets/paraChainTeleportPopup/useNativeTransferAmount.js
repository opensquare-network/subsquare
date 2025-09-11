import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import useApiProperties from "next-common/hooks/useApiProperties";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import { useCallback, useState } from "react";

export default function useNativeTransferAmount({ api, transferFromAddress }) {
  const {
    symbol,
    decimals,
    isLoading: isLoadingApiProperties,
  } = useApiProperties(api);
  const [transferAmount, setTransferAmount] = useState("");
  const { transferrable, isLoading: isLoadingTransferrable } =
    useAccountTransferrable(api, transferFromAddress);
  const isLoading = isLoadingTransferrable || isLoadingApiProperties;

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
