import { useChainSettings } from "next-common/context/chain";
import { useCallback } from "react";
import BigNumber from "bignumber.js";

export default function PercentageTooltip(
  {
    referendumIndex,
    directPercentage,
    directAmount,
    delegatedPercentage,
    delegatedAmount,
  },
) {
  const { symbol, decimals } = useChainSettings();
  const fromUnit = useCallback(
    (value) => new BigNumber(value).div(Math.pow(10, decimals)).toFixed(2),
    [decimals],
  );

  return (
    <div style={ { display: "flex", flexDirection: "column" } }>
      <span style={ { fontWeight: 600 } }>Referendum #{ referendumIndex }</span>
      <span>
        Direct: { directPercentage.toFixed(2) }% ({ fromUnit(directAmount) }{ " " }
        { symbol })
      </span>
      <span>
        Delegated: { delegatedPercentage.toFixed(2) }% (
        { fromUnit(delegatedAmount) } { symbol })
      </span>
    </div>
  );
}
