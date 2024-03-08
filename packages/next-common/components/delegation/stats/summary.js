import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export default function Summary({ delegator, delegatee, capital }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "DELEGATOR ADDRESS",
            content: delegator,
          },
          {
            title: "DELEGATED ADDRESS",
            content: delegatee,
          },
          {
            title: "CAPITAL",
            content: (
              <ValueDisplay
                value={toPrecision(capital, decimals)}
                symbol={symbol}
              />
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
