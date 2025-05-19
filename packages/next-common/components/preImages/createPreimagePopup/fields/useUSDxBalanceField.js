import { useState } from "react";
import USDxBalanceField from "next-common/components/popup/fields/usdxBalanceField";
import useAssetHubTreasuryBalance from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import Loading from "next-common/components/loading";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export function TreasuryBalance({ symbol, isLoading, treasuryBalance }) {
  return (
    <div className="flex items-center gap-[8px] text14Medium text-textPrimary [&_.value-display-symbol]:text-textPrimary">
      <span className="text14Medium text-textTertiary">Treasury Balance</span>
      {isLoading ? (
        <Loading size={16} />
      ) : (
        <ValueDisplay value={treasuryBalance} symbol={symbol} />
      )}
    </div>
  );
}

function USDxBalance({ inputBalance, setInputBalance, symbol, setSymbol }) {
  const {
    balance: treasuryBalance,
    decimals: treasuryBalanceDecimals,
    loading: isTreasuryBalanceLoading,
  } = useAssetHubTreasuryBalance(symbol);

  return (
    <USDxBalanceField
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

export default function useUSDxBalanceField() {
  const [inputBalance, setInputBalance] = useState("");
  const [symbol, setSymbol] = useState("USDT");

  return {
    value: [inputBalance, symbol],
    component: (
      <USDxBalance
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
        symbol={symbol}
        setSymbol={setSymbol}
      />
    ),
  };
}
