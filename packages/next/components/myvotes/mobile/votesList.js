import VoteListItem from "./voteListItem";
import ProxyHint from "../proxyHint";
import ListWrapper from "./listWrapper";

export default function MobileVotesList({ votes, isLoading }) {
  return (
    <ListWrapper isLoading={isLoading}>
      <div className="flex flex-col gap-[16px]">
        <ProxyHint />
        {(votes || []).map((item) => (
          <VoteListItem key={item.referendumIndex} vote={item} />
        ))}
      </div>
    </ListWrapper>
  );
}
