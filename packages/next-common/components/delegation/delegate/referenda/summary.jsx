import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPercentage, toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function ReferendaDelegationCardSummary({
  delegate,
  className = "",
}) {
  const { decimals, symbol } = useChainSettings();

  const { delegatorsCount, maxTrackDelegations, participationRate } = delegate;

  return (
    <SummaryLayout className={className}>
      <SummaryItem title="Max Delegated">
        <ValueDisplay
          value={toPrecision(maxTrackDelegations, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
      <SummaryItem title="Delegators">{delegatorsCount}</SummaryItem>
      <SummaryItem title="Participation">
        {toPercentage(participationRate, 1) + "%"}
      </SummaryItem>
    </SummaryLayout>
  );
}
