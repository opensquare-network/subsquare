import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SummaryCard from "../common/summaryCard";

export default function DemocracyBeenDelegatedSummary({
  delegations,
  addressesCount,
  isLoading,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryCard
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
  );
}
