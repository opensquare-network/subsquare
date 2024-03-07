import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import { profileReferendaDelegationsSelector } from "next-common/store/reducers/profile/referendaDelegations";
import { useSelector } from "react-redux";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export function getTracksItem({ isLoading, delegations }) {
  return {
    title: "Tracks",
    content: (
      <LoadableContent isLoading={isLoading}>
        <CountSummaryContent count={delegations?.length || 0} />
      </LoadableContent>
    ),
  };
}

export function SummaryCard({ items }) {
  return (
    <SecondaryCard>
      <SummaryItems items={items} />
    </SecondaryCard>
  );
}

export default function OpenGovDelegationSummary() {
  const delegations = useSelector(profileReferendaDelegationsSelector);
  const isLoading = !delegations;

  return (
    <SummaryCard
      items={[
        getTracksItem({
          isLoading,
          delegations,
        }),
      ]}
    />
  );
}
