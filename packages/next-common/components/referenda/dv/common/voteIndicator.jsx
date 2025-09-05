import VoteStatus from "./voteStatus";
import { VOTE_TYPE } from "next-common/utils/dv/voteType";

export function VoteIndicator() {
  return (
    <div className="flex gap-x-4 items-center justify-center py-4 text-textSecondary text12Medium">
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.Aye} /> Aye
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.Nay} /> Nay
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.Abstain} /> Abstain
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.NoVote} /> No Vote
      </div>
    </div>
  );
}
