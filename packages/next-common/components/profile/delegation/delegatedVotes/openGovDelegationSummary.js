import LoadableContent from "next-common/components/common/loadableContent";
import { profileReferendaDelegationsSelector } from "next-common/store/reducers/profile/referendaDelegations";
import { useSelector } from "react-redux";
import SummaryCard from "../common/summaryCard";

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
