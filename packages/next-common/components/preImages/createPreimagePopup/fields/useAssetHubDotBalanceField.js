import { useState } from "react";
import { toPrecision } from "next-common/utils";
import { useTreasuryAssetBalance } from "next-common/hooks/treasury/useAssetBalance";
import { useChainSettings } from "next-common/context/chain";
import CurrencyInput from "next-common/components/currencyInput";
import PopupLabel from "next-common/components/popup/label";
import { TreasuryProvider } from "next-common/context/treasury";
import { TreasuryBalance } from "./useUSDxBalanceField";

function AssetHubDotBalance({ inputBalance, setInputBalance }) {
  const { symbol } = useChainSettings();
  const {
    balance: treasuryBalance,
    decimals: treasuryBalanceDecimals,
    loading: isTreasuryBalanceLoading,
  } = useTreasuryAssetBalance(symbol);

  return (
    <div>
      <PopupLabel
        text="Request"
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
      <CurrencyInput
        value={inputBalance}
        onValueChange={setInputBalance}
        symbol={symbol}
      />
    </div>
  );
}

export default function useAssetHubDotBalanceField() {
  const [inputBalance, setInputBalance] = useState("");

  return {
    value: inputBalance,
    component: (
      <TreasuryProvider>
        <AssetHubDotBalance
          inputBalance={inputBalance}
          setInputBalance={setInputBalance}
        />
      </TreasuryProvider>
    ),
  };
}
