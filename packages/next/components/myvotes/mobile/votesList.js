import VoteListItem from "./voteListItem";
import EmptyList from "next-common/components/profile/votingHistory/mobile/emptyList";
import LoadingList from "next-common/components/profile/votingHistory/mobile/loadingList";
import ProxyHint from "../proxyHint";

export default function MobileVotesList({ votes, isLoading }) {
  if (isLoading) {
    return <LoadingList />;
  }

  if (votes.length === 0) {
    return <EmptyList />;
  }

  const listContent = (votes || []).map((item) => (
    <VoteListItem key={item.referendumIndex} vote={item} />
  ));

  return (
    <div className="flex flex-col gap-[16px]">
      <ProxyHint />
      {listContent}
    </div>
  );
}
