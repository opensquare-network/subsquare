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
import useReferendumTitle from "../useReferendumTitle";

function ItemHeader({ vote }) {
  const referendumPost = useVotedPost(vote.referendumIndex);
  const title = useReferendumTitle({
    trackId: vote.trackId,
    referendumIndex: vote.referendumIndex,
  });

  return (
    <div>
      <div className="flex items-center justify-between pb-[12px] border-b border-b-neutral300">
        <PostTitle referendumIndex={vote.referendumIndex} title={title} />
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
  const normalizedVote = normalizeVote(vote.vote);
  return (
    <ListCard>
      <ItemHeader vote={vote} />
      <div className="flex flex-col mt-[24px] gap-2">
        <VoteItem vote={normalizedVote} />
        <VoteLock lockInfo={lockInfo} />
      </div>
    </ListCard>
  );
}
