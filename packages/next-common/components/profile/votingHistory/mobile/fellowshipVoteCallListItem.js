import { ListCard } from "../styled";
import {
  PostTitle,
  ReferendumTag,
  CallDate,
  FellowshipVoteItem,
} from "../common";

function ItemHeader({ vote }) {
  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={vote.proposal?.title}
        />
      </div>
      <div className="flex justify-between pt-[12px] items-center">
        <CallDate vote={vote} />
        <ReferendumTag proposal={vote.proposal} />
      </div>
    </div>
  );
}

export default function FellowshipVoteCallListItem({ vote }) {
  return (
    <ListCard>
      <ItemHeader vote={vote} />
      <div className="mt-[24px]">
        <FellowshipVoteItem vote={vote} />
      </div>
    </ListCard>
  );
}
