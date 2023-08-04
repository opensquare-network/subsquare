import { ListCard } from "../styled";
import {
  PostTitle,
  ReferendumTag,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import { normalizeVote } from "../common";
import FieldLoading from "next-common/components/icons/fieldLoading";
// import RemoveVoteButton from "../removeVoteButton";
import useVotedPost from "../useVotedPost";

function ItemHeader({ vote, isGov2 }) {
  const referendumPost = useVotedPost(vote.referendumIndex);

  return (
    <div>
      <div className="flex items-center justify-between pb-[12px] border-b border-b-neutral-300">
        {referendumPost ? (
          <PostTitle
            referendumIndex={vote.referendumIndex}
            title={referendumPost?.title}
            isGov2={isGov2}
          />
        ) : (
          <FieldLoading />
        )}
        {/* <RemoveVoteButton key="action" vote={vote} isGov2={isGov2} /> */}
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        {referendumPost ? (
          <ReferendumTag
            proposal={referendumPost?.onchainData}
            isGov2={isGov2}
          />
        ) : (
          <FieldLoading />
        )}
      </div>
    </div>
  );
}

export default function VoteListItem({ vote, isGov2 }) {
  const normalizedVote = normalizeVote(vote.vote);
  return (
    <ListCard>
      <ItemHeader vote={vote} isGov2={isGov2} />
      <div className="mt-[24px]">
        <VoteItem vote={normalizedVote} />
      </div>
    </ListCard>
  );
}
