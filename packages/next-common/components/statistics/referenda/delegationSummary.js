import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function DelegationSummary({ delegator, delegatee, capital }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="DELEGATE">{delegatee || 0}</SummaryItem>
        <SummaryItem title="DELEGATOR">{delegator || 0}</SummaryItem>
        <SummaryItem title="CAPITAL">
          <ValueDisplay
            value={toPrecision(capital || 0, decimals)}
            symbol={symbol}
          />
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
