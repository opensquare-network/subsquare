import { VoteItem } from "next-common/components/profile/votingHistory/common";
import useVoteExpiration from "./useVoteExpiration";
import VoteLock from "./lock";
import { VoteForItemWrapper } from "../styled";

export default function MyVoteItem({ vote }) {
  const lockInfo = useVoteExpiration(vote);

  return (
    <VoteForItemWrapper>
      <VoteItem key="vote" vote={vote.vote} />
      <VoteLock lockInfo={lockInfo} />
    </VoteForItemWrapper>
  );
}
