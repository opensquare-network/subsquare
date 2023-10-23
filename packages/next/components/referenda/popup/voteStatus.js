import { VotingStatusContent } from "next-common/components/popup/styled";
import PopupLabel from "next-common/components/popup/label";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";

export default function VoteStatus({ votes, status, tooltip }) {
  return (
    <VotingStatusContent>
      <PopupLabel text="Current voting" status={status} tooltip={tooltip} />
      <div className="flex flex-col gap-[16px]">
        <div>
          {votes.map((vote, i) => (
            <VoteItem key={i} vote={vote} />
          ))}
        </div>
      </div>
    </VotingStatusContent>
  );
}
