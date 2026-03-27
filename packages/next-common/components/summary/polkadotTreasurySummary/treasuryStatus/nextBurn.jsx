import useTreasuryBurnWithPapi from "next-common/utils/hooks/useTreasuryBurnWithPapi";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { useContextPapiApi } from "next-common/context/papi";

export default function NextBurn({ free = 0 }) {
  const api = useContextPapiApi();
  const nextBurn = useTreasuryBurnWithPapi(api, free || 0);
  const { symbol, decimals } = useChainSettings();

  return (
    <div>
      <ValueDisplay
        showApproximationSymbol={false}
        value={toPrecision(nextBurn, decimals)}
        symbol={symbol}
        className={"text12Medium text-textPrimary"}
      />
    </div>
  );
}
