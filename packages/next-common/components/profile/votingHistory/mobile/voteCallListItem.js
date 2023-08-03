import { ListCard } from "../styled";
import {
  PostTitle,
  ReferendumTag,
  CallDate,
  normalizeCall,
  VoteItem,
} from "../common";
import { useChain } from "next-common/context/chain";

function ItemHeader({ vote, isGov2 }) {
  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral-300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={vote.proposal?.title}
          isGov2={isGov2}
        />
      </div>
      <div className="flex justify-between pt-[12px] items-center">
        <CallDate vote={vote} />
        <ReferendumTag proposal={vote.proposal} isGov2={isGov2} />
      </div>
    </div>
  );
}

export default function VoteCallListItem({ vote, isGov2 }) {
  const chain = useChain();

  return (
    <ListCard>
      <ItemHeader vote={vote} isGov2={isGov2} />
      <div className="mt-[24px]">
        <VoteItem vote={normalizeCall(vote, chain)} />
      </div>
    </ListCard>
  );
}
