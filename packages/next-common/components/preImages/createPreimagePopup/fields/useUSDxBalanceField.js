import { useState } from "react";
import USDxBalanceField from "next-common/components/popup/fields/usdxBalanceField";
import { useTreasuryAssetBalance } from "next-common/hooks/treasury/useAssetBalance";
import useAssetHubTreasuryBalanceFromCollectives from "next-common/hooks/treasury/useAssetHubTreasuryBalanceFromCollectives";
import Loading from "next-common/components/loading";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { TreasuryProvider } from "next-common/context/treasury";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

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

function DefaultUSDxBalance({
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

function CollectivesUSDxBalance({
  inputBalance,
  setInputBalance,
  symbol,
  setSymbol,
}) {
  const {
    balance: treasuryBalance,
    decimals: treasuryBalanceDecimals,
    loading: isTreasuryBalanceLoading,
  } = useAssetHubTreasuryBalanceFromCollectives(symbol);

  return (
    <USDxBalanceField
      symbolOptions={["USDT", "USDC", "HOLLAR"]}
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

export function USDxBalance({
  inputBalance,
  setInputBalance,
  symbol,
  setSymbol,
}) {
  const chain = useChain();

  if (chain === Chains.collectives) {
    return (
      <CollectivesUSDxBalance
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
        symbol={symbol}
        setSymbol={setSymbol}
      />
    );
  }

  return (
    <DefaultUSDxBalance
      inputBalance={inputBalance}
      setInputBalance={setInputBalance}
      symbol={symbol}
      setSymbol={setSymbol}
    />
  );
}

export default function useUSDxBalanceField() {
  const [inputBalance, setInputBalance] = useState("");
  const [symbol, setSymbol] = useState("USDT");

  return {
    value: [inputBalance, symbol],
    component: (
      <TreasuryProvider>
        <USDxBalance
          inputBalance={inputBalance}
          setInputBalance={setInputBalance}
          symbol={symbol}
          setSymbol={setSymbol}
        />
      </TreasuryProvider>
    ),
  };
}
