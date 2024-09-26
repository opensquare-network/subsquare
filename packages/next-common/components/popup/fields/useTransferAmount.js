import { useCallback, useState } from "react";
import TransferAmount from "./transferAmountField";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";

/**
 * @param {Omit<Parameters<typeof TransferAmount>[0], "transferAmount" | "setTransferAmount">} props
 */
export function useTransferAmount(props = {}) {
  const { transferrable, decimals, symbol, transferFromAddress, isLoading } =
    props;

  const [transferAmount, setTransferAmount] = useState("");

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
  }, [transferAmount, decimals, transferrable]);

  return {
    value: transferAmount,
    component,
    getCheckedValue,
  };
}
