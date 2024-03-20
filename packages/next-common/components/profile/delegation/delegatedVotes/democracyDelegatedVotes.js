import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";

export default function DemocracyDelegatedVotes({ delegating, isLoading }) {
  const { decimals, symbol } = useChainSettings();
  const votes = new BigNumber(delegating?.balance || 0)
    .times(ConvictionSupport[delegating?.conviction] || 0)
    .toString();

  return (
    <SecondaryCard>
      <Summary
        items={[
          {
            title: "Delegated Votes",
            content: (
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay
                  value={toPrecision(votes || 0, decimals)}
                  symbol={symbol}
                />
              </LoadableContent>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
