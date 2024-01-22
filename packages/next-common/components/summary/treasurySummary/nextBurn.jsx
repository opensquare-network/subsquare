import useTreasuryBurn from "next-common/utils/hooks/useTreasuryBurn";
import useApi from "next-common/utils/hooks/useApi";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";

export default function TreasurySummaryNextBurn({ free = 0 }) {
  const api = useApi();
  const nextBurn = useTreasuryBurn(api, free || 0);
  const { symbol, decimals } = useChainSettings();

  return (
    <div>
      <ValueDisplay
        showApproximationSymbol={false}
        value={toPrecision(nextBurn, decimals)}
        symbol={symbol}
      />
    </div>
  );
}
