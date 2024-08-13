import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import { useState } from "react";

export default function useNativeTransferAmount({ api, transferFromAddress }) {
  const [transferAmount, setTransferAmount] = useState("");
  const { transferrable, isLoading } = useAccountTransferrable(
    api,
    transferFromAddress,
  );

  const component = (
    <TransferAmount
      transferrable={transferrable}
      decimals={10}
      symbol={"DOT"}
      isLoading={isLoading}
      transferFromAddress={transferFromAddress}
      transferAmount={transferAmount}
      setTransferAmount={setTransferAmount}
    />
  );

  return {
    value: transferAmount,
    transferrable,
    component,
  };
}
