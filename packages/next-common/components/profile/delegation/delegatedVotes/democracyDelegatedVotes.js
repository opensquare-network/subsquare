import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function DemocracyDelegatedVotes({ delegating, isLoading }) {
  const { decimals, symbol } = useChainSettings();
  const votes = new BigNumber(delegating?.balance || 0)
    .times(ConvictionSupport[delegating?.conviction] || 0)
    .toString();
  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Delegated Votes">
          <LoadableContent isLoading={isLoading}>
            <ValueDisplay
              value={toPrecision(votes || 0, decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
