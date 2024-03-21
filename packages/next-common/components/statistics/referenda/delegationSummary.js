import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function DelegationSummary({ delegator, delegatee, capital }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <SecondaryCard>
      <Summary
        items={[
          {
            title: "DELEGATE",
            content: delegatee || 0,
          },
          {
            title: "DELEGATOR",
            content: delegator || 0,
          },
          {
            title: "CAPITAL",
            content: (
              <ValueDisplay
                value={toPrecision(capital || 0, decimals)}
                symbol={symbol}
              />
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
