import LoadableContent from "next-common/components/common/loadableContent";
import { profileReferendaDelegationsSelector } from "next-common/store/reducers/profile/referendaDelegations";
import { useSelector } from "react-redux";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export function TracksItem({ isLoading, delegations }) {
  return (
    <SummaryItem title="Tracks">
      <LoadableContent isLoading={isLoading}>
        <CountSummaryContent count={delegations?.length || 0} />
      </LoadableContent>
    </SummaryItem>
  );
}

export default function OpenGovDelegationSummary() {
  const delegations = useSelector(profileReferendaDelegationsSelector);
  const isLoading = !delegations;

  return (
    <SecondaryCard>
      <SummaryLayout>
        <TracksItem isLoading={isLoading} delegations={delegations} />
      </SummaryLayout>
    </SecondaryCard>
  );
}
