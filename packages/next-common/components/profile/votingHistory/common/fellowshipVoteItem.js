import tw from "tailwind-styled-components";
import { Aye, Nay } from "./voteItem";

const PartialVoteItem = tw.div`flex justify-between md:w-[120px]`;

export function FellowshipVoteItem({ vote }) {
  return (
    <PartialVoteItem>
      {vote.isAye ? <Aye /> : <Nay />}
      <span className="text-textPrimary">{vote.votes}</span>
    </PartialVoteItem>
  );
}
