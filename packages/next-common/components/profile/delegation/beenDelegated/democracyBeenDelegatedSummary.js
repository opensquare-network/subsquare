import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
export default function DemocracyBeenDelegatedSummary({
  delegations,
  addressesCount,
  isLoading,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Been Delegated Votes">
          <LoadableContent isLoading={isLoading}>
            <ValueDisplay
              value={toPrecision(delegations?.votes || 0, decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Delegators">
          <LoadableContent isLoading={isLoading}>
            {addressesCount}
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
