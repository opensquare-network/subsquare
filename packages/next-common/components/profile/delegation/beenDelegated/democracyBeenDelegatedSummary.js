import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function DemocracyBeenDelegatedSummary({
  delegations,
  addressesCount,
  isLoading,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Been Delegated Votes",
            content: (
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay
                  value={toPrecision(delegations?.votes || 0, decimals)}
                  symbol={symbol}
                />
              </LoadableContent>
            ),
          },
          {
            title: "Delegators",
            content: (
              <LoadableContent isLoading={isLoading}>
                {addressesCount}
              </LoadableContent>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
