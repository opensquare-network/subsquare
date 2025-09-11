import useTreasuryBurn from "next-common/utils/hooks/useTreasuryBurn";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { useContextApi } from "next-common/context/api";

export default function NextBurn({ free = 0 }) {
  const api = useContextApi();
  const nextBurn = useTreasuryBurn(api, free || 0);
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
