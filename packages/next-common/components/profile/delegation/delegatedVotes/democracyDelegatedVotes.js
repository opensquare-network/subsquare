import BigNumber from "bignumber.js";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";

export default function DemocracyDelegatedVotes({ delegating }) {
  const { decimals, symbol } = useChainSettings();
  const votes = new BigNumber(delegating?.balance || 0)
    .times(ConvictionSupport[delegating?.conviction] || 0)
    .toString();

  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Delegated Votes",
            content: (
              <div>
                <ValueDisplay
                  value={toPrecision(votes || 0, decimals)}
                  symbol={symbol}
                />
              </div>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
