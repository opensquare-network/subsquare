import { useChainSettings } from "next-common/context/chain";
import { useCallback } from "react";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";

export default function PercentageTooltip({
  referendumIndex,
  directPercentage,
  directAmount,
  delegatedPercentage,
  delegatedAmount,
}) {
  const { symbol, decimals } = useChainSettings();
  const fromUnit = useCallback(
    (value) => new BigNumber(value).div(Math.pow(10, decimals)).toFixed(2),
    [decimals],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: 600 }}>Referendum #{referendumIndex}</span>
      <span>
        Direct: {directPercentage.toFixed(2)}% (
        <ValueDisplay value={fromUnit(directAmount)} symbol={symbol} />)
      </span>
      <span>
        Delegated: {delegatedPercentage.toFixed(2)}% (
        <ValueDisplay value={fromUnit(delegatedAmount)} symbol={symbol} />)
      </span>
    </div>
  );
}
