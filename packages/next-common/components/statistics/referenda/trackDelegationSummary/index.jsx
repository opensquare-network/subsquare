import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "../../styled";
import TrackDelegationChart from "./trackDelegationChart";

export default function TrackDelegationSummary({ tracks }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Track Delegation</StatisticsTitle>
      <TrackDelegationChart tracks={tracks} />
    </SecondaryCard>
  );
}
