import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import { VoteSuccessfulWrapper, VoteFor } from "next-common/components/vote";

export default function VoteSuccessful({ addressVote, onClose }) {
  return (
    <VoteSuccessfulWrapper onClose={onClose}>
      <VoteFor>
        <span>Vote for</span>
      </VoteFor>
      <VoteItem vote={addressVote} />
    </VoteSuccessfulWrapper>
  );
}
