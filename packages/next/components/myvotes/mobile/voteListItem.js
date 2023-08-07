import { ListCard } from "../styled";
import {
  PostTitle,
  ReferendumTag,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import { normalizeVote } from "../common";
import FieldLoading from "next-common/components/icons/fieldLoading";
import RemoveVoteButton from "../removeVoteButton";
import useVotedPost from "../useVotedPost";
import useVoteExpiration from "../vote/useVoteExpiration";
import VoteLock from "../vote/lock";

function ItemHeader({ vote }) {
  const referendumPost = useVotedPost(vote.referendumIndex);

  return (
    <div>
      <div className="flex items-center justify-between pb-[12px] border-b border-b-neutral-300">
        {referendumPost ? (
          <PostTitle
            referendumIndex={vote.referendumIndex}
            title={referendumPost?.title}
          />
        ) : (
          <FieldLoading />
        )}
        <RemoveVoteButton key="action" vote={vote} />
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        {referendumPost ? (
          <ReferendumTag proposal={referendumPost?.onchainData} />
        ) : (
          <FieldLoading />
        )}
      </div>
    </div>
  );
}

export default function VoteListItem({ vote }) {
  const lockInfo = useVoteExpiration(vote);
  console.log("lockInfo", lockInfo);
  const normalizedVote = normalizeVote(vote.vote);
  return (
    <ListCard>
      <ItemHeader vote={vote} />
      <div className="mt-[24px]">
        <VoteItem vote={normalizedVote} />
        <VoteLock lockInfo={lockInfo} />
      </div>
    </ListCard>
  );
}
