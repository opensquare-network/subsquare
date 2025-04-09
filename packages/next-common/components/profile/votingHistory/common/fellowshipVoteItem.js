import { Aye, Nay } from "./voteItem";

export function FellowshipVoteItem({ vote, showVoteTag }) {
  return (
    <div className="flex justify-between md:w-[120px]">
      {showVoteTag && <span className="text-textTertiary">Vote</span>}
      {vote.isAye ? <Aye /> : <Nay />}
      <span className="text-textPrimary">{vote.votes}</span>
    </div>
  );
}
