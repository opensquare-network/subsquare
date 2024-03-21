import Summary from "next-common/components/summary";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPercentage, toPrecision } from "next-common/utils";

export default function DemocracyDelegationCardSummary({
  delegate,
  className = "",
}) {
  const { decimals, symbol } = useChainSettings();

  const { delegatorsCount, votes, participationRate } = delegate;

  return (
    <Summary
      className={className}
      items={[
        {
          title: "Delegated Votes",
          content: (
            <ValueDisplay
              value={toPrecision(votes, decimals)}
              symbol={symbol}
            />
          ),
        },
        {
          title: "Delegators",
          content: delegatorsCount,
        },
        {
          title: "Participation",
          content: toPercentage(participationRate, 1) + "%",
        },
      ]}
    />
  );
}
