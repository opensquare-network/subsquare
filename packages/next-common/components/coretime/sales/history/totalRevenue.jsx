import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function CoretimeSalesHistoryTotalRevenue({ data = {} }) {
  const { symbol, decimals } = useChainSettings();

  return (
    <div>
      <ValueDisplay
        value={toPrecision(data?.totalRevenue || 0, decimals)}
        symbol={symbol}
      />
    </div>
  );
}
