import { usePageProps } from "next-common/context/page";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";

export default function TotalBurntSummary() {
  const { burntSummary } = usePageProps();
  const { symbol, decimals } = useChainSettings();

  return (
    <SummaryItem title="Total Burnt">
      <ValueDisplay
        value={toPrecision(burntSummary?.totalBurnt, decimals)}
        symbol={symbol}
      />
    </SummaryItem>
  );
}
