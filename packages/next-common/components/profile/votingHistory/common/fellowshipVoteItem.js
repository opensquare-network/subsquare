import tw from "tailwind-styled-components";
import { Aye, Nay } from "./voteItem";

const ItemWrapper = tw.div`flex max-md:justify-between max-md:grow`;

const VoteWrapper = tw.div`flex flex-col gap-[2px] max-md:grow`;

const PartialVoteItem = tw.div`flex justify-between md:w-[200px]`;

export function FellowshipVoteItem({ vote }) {
  return (
    <ItemWrapper>
      <VoteWrapper>
        <PartialVoteItem>
          {vote.isAye ? <Aye /> : <Nay />}
          <span>{vote.votes}</span>
        </PartialVoteItem>
      </VoteWrapper>
    </ItemWrapper>
  );
}
