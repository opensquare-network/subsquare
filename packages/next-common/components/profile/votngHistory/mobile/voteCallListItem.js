import { ListCard } from "../styled";
import VoteItem from "../voteItem";
import { normalizeCall } from "../common";
import { PostTitle } from "../common";
import ReferendumTag from "../common/referendumTag";
import CallDate from "../common/date";
import { useChain } from "next-common/context/chain";

function ItemHeader({ vote, isGov2 }) {
  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral-300">
        <PostTitle vote={vote} isGov2={isGov2} />
      </div>
      <div className="flex justify-between pt-[12px] items-center">
        <CallDate vote={vote} />
        <ReferendumTag vote={vote} isGov2={isGov2} />
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
