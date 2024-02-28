import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import { referendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/referendaDelegations";
import { useSelector } from "react-redux";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export default function TracksSummary() {
  const delegations = useSelector(referendaDelegationsSelector);

  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Tracks",
            content: <CountSummaryContent count={delegations?.length || 0} />,
          },
        ]}
      />
    </SecondaryCard>
  );
}
