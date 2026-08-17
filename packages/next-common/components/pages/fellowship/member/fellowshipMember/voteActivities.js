import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import FellowshipMemberVotes from "./fellowshipMemberVotes";
import VoteActivitySummary from "./voteActivitySummary";
import { usePageProps } from "next-common/context/page";

export default function VoteActivities() {
  const { id: address } = usePageProps();

  return (
    <SecondaryCard>
      <VoteActivitySummary />
      <div className="mt-[16px]">
        <CardTitle>History</CardTitle>
        <FellowshipMemberVotes address={address} />
      </div>
    </SecondaryCard>
  );
}
