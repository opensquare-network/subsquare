import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

function ValueSummaryContent({ value }) {
  const { voteSymbol, symbol, decimals } = useChainSettings();
  return (
    <div>
      <ValueDisplay
        value={toPrecision(value || 0, decimals)}
        symbol={voteSymbol || symbol}
      />
    </div>
  );
}

export default function DemocracySummary({ summary }) {
  return (
    <SummaryLayout>
      <SummaryItem title="DELEGATEE">
        <CountSummaryContent
          count={(summary?.address || summary?.addresses)?.delegatee}
        />
      </SummaryItem>
      <SummaryItem title="DELEGATOR">
        <CountSummaryContent
          count={(summary?.address || summary?.addresses)?.delegator}
        />
      </SummaryItem>
      <SummaryItem title="TOTAL CAPITAL">
        <ValueSummaryContent value={summary?.votes?.capital} />
      </SummaryItem>
      <SummaryItem title="TOTAL VOTES">
        <ValueSummaryContent value={summary?.votes?.votes} />
      </SummaryItem>
    </SummaryLayout>
  );
}
