import { Aye, Nay } from "./voteItem";

export function FellowshipVoteItem({ vote }) {
  return (
    <div className="flex justify-between md:w-[120px]">
      {vote.isAye ? <Aye /> : <Nay />}
      <span className="text-textPrimary">{vote.votes}</span>
    </div>
  );
}
