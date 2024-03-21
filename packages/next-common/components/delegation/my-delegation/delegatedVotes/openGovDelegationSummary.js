import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import { getTracksItem } from "next-common/components/profile/delegation/delegatedVotes/openGovDelegationSummary";
import SummaryCard from "next-common/components/profile/delegation/common/summaryCard";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { toPrecision } from "next-common/utils";
import { useSelector } from "react-redux";

function getDelegatedVotesItem({ isLoading, delegations, decimals, symbol }) {
  const totalDelegated = delegations
    ?.reduce((acc, { votes }) => acc.plus(votes), new BigNumber(0))
    .toString();

  return {
    title: "Delegated Votes",
    content: (
      <LoadableContent isLoading={isLoading}>
        <ValueDisplay
          value={toPrecision(totalDelegated || 0, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };
}

export default function OpenGovDelegationSummary() {
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { decimals, symbol } = useChainSettings();
  const isLoading = !delegations;

  return (
    <SummaryCard
      items={[
        getTracksItem({
          isLoading,
          delegations,
        }),
        getDelegatedVotesItem({
          isLoading,
          delegations,
          decimals,
          symbol,
        }),
      ]}
    />
  );
}
