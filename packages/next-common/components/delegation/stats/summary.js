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
            content: delegator || 0,
          },
          {
            title: "DELEGATED ADDRESS",
            content: delegatee || 0,
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
