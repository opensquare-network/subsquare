import VoteListItem from "./voteListItem";
import EmptyList from "next-common/components/profile/votingHistory/mobile/emptyList";
import LoadingList from "next-common/components/profile/votingHistory/mobile/loadingList";

export default function MobileVotesList({ votes, isGov2 }) {
  if (!votes) {
    return <LoadingList />;
  }

  if (votes.length === 0) {
    return <EmptyList />;
  }

  const listContent = (votes || []).map((item) => (
    <VoteListItem key={item.referendumIndex} vote={item} isGov2={isGov2} />
  ));

  return <div className="flex flex-col gap-[16px]">{listContent}</div>;
}
