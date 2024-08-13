import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import { useState } from "react";

export default function useTransferAmount({ asset, transferFromAddress }) {
  const [transferAmount, setTransferAmount] = useState("");

  const component = (
    <TransferAmount
      transferrable={asset.transferrable}
      decimals={asset.decimals}
      symbol={asset.symbol}
      transferFromAddress={transferFromAddress}
      transferAmount={transferAmount}
      setTransferAmount={setTransferAmount}
    />
  );

  return { value: transferAmount, component };
}
