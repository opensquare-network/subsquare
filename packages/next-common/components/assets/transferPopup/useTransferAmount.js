import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import { useCallback, useState } from "react";

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

  const getCheckedValue = useCallback(() => {
    return checkTransferAmount({
      transferAmount,
      decimals: asset.decimals,
      transferrable: asset.transferrable,
    });
  }, [transferAmount, asset.transferrable, asset.decimals]);

  return { value: transferAmount, getCheckedValue, component };
}
