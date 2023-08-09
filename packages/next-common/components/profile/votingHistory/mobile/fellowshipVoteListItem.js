import { ListCard } from "../styled";
import { PostTitle, ReferendumTag, FellowshipVoteItem } from "../common";

function ItemHeader({ vote }) {
  return (
    <div>
      <div className="flex justify-between items-center pb-[12px] border-b border-b-neutral300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={vote.proposal?.title}
        />
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <ReferendumTag proposal={vote.proposal} />
      </div>
    </div>
  );
}

export default function FellowshipVoteListItem({ vote }) {
  return (
    <ListCard>
      <ItemHeader vote={vote} />
      <div className="mt-[24px]">
        <FellowshipVoteItem vote={vote} />
      </div>
    </ListCard>
  );
}
