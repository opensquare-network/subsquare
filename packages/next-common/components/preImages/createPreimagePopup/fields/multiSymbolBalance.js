import MultiSymbolBalanceField from "next-common/components/popup/fields/multiSymbolBalanceField";
import { useTreasuryAssetBalance } from "next-common/hooks/treasury/useAssetBalance";
import { toPrecision } from "next-common/utils";
import { TreasuryBalance } from "./useUSDxBalanceField";

export function MultiSymbolBalance({
  inputBalance,
  setInputBalance,
  symbol,
  setSymbol,
}) {
  const {
    balance: treasuryBalance,
    decimals: treasuryBalanceDecimals,
    loading: isTreasuryBalanceLoading,
  } = useTreasuryAssetBalance(symbol);

  return (
    <MultiSymbolBalanceField
      title="Request"
      inputBalance={inputBalance}
      setInputBalance={setInputBalance}
      symbol={symbol}
      setSymbol={setSymbol}
      status={
        <TreasuryBalance
          isLoading={isTreasuryBalanceLoading}
          symbol={symbol}
          treasuryBalance={toPrecision(
            treasuryBalance,
            treasuryBalanceDecimals,
          )}
        />
      }
    />
  );
}
