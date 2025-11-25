import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export function BondField({ bondAmount, setBondAmount }) {
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const realAddress = useRealAddress();
  const { transferrable, isLoading: isLoadingTransferrable } =
    useAccountTransferrable(api, realAddress);

  return (
    <AmountInputWithHint
      label="Bond"
      maxAmount={transferrable}
      isLoading={isLoadingTransferrable}
      decimals={decimals}
      inputBalance={bondAmount}
      setInputBalance={setBondAmount}
      symbol={symbol}
    />
  );
}
