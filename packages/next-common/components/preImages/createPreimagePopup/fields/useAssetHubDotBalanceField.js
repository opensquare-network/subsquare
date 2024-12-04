import { useState } from "react";
import { toPrecision } from "next-common/utils";
import { useQueryAssetHubTreasuryFree } from "next-common/components/summary/polkadotTreasurySummary/hook/useQueryAssetHubTreasuryFree";
import { useChainSettings } from "next-common/context/chain";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { TreasuryBalance } from "./useUSDxBalanceField";

function AssetHubDotBalance({ inputBalance, setInputBalance }) {
  const { symbol, decimals } = useChainSettings();
  const { free: treasuryBalance, isLoading: isTreasuryBalanceLoading } =
    useQueryAssetHubTreasuryFree(StatemintTreasuryAccount);

  return (
    <div>
      <PopupLabel
        text="Request"
        status={
          <TreasuryBalance
            isLoading={isTreasuryBalanceLoading}
            symbol={symbol}
            treasuryBalance={toPrecision(treasuryBalance, decimals)}
          />
        }
      />
      <Input
        value={inputBalance}
        onChange={(e) => setInputBalance(e.target.value.replace("。", "."))}
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
      <AssetHubDotBalance
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
    ),
  };
}
