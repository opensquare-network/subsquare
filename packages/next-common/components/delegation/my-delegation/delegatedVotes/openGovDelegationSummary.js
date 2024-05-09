import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import { TracksItem } from "next-common/components/profile/delegation/delegatedVotes/openGovDelegationSummary";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { toPrecision } from "next-common/utils";
import { useSelector } from "react-redux";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

function DelegatedVotesItem({ isLoading, delegations, decimals, symbol }) {
  const totalDelegated = delegations
    ?.reduce((acc, { votes }) => acc.plus(votes), new BigNumber(0))
    .toString();

  return (
    <SummaryItem title="Delegated Votes">
      <LoadableContent isLoading={isLoading}>
        <ValueDisplay
          value={toPrecision(totalDelegated || 0, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    </SummaryItem>
  );
}

export default function OpenGovDelegationSummary() {
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { decimals, symbol } = useChainSettings();
  const isLoading = !delegations;

  return (
    <SecondaryCard>
      <SummaryLayout>
        <TracksItem isLoading={isLoading} delegations={delegations} />
        <DelegatedVotesItem
          isLoading={isLoading}
          delegations={delegations}
          decimals={decimals}
          symbol={symbol}
        />
      </SummaryLayout>
    </SecondaryCard>
  );
}
