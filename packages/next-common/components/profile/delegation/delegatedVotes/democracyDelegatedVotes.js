import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { ConvictionSupport } from "next-common/utils/referendumCommon";
import SummaryCard from "../common/summaryCard";

function getDelegatedVotesItem({ delegating, isLoading, decimals, symbol }) {
  const votes = new BigNumber(delegating?.balance || 0)
    .times(ConvictionSupport[delegating?.conviction] || 0)
    .toString();

  return {
    title: "Delegated Votes",
    content: (
      <LoadableContent isLoading={isLoading}>
        <ValueDisplay
          value={toPrecision(votes || 0, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };
}

export default function DemocracyDelegatedVotes({ delegating, isLoading }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryCard
      items={[
        getDelegatedVotesItem({
          delegating,
          isLoading,
          decimals,
          symbol,
        }),
      ]}
    />
  );
}
