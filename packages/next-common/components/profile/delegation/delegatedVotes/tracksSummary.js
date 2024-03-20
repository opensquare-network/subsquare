import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary";
import { profileReferendaDelegationsSelector } from "next-common/store/reducers/profile/referendaDelegations";
import { useSelector } from "react-redux";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export default function TracksSummary() {
  const delegations = useSelector(profileReferendaDelegationsSelector);
  const isLoading = !delegations;

  return (
    <SecondaryCard>
      <Summary
        items={[
          {
            title: "Tracks",
            content: (
              <LoadableContent isLoading={isLoading}>
                <CountSummaryContent count={delegations?.length || 0} />
              </LoadableContent>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
