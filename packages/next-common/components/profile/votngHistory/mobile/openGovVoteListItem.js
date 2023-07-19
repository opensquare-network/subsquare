import { ListCard } from "../styled";
import VoteItem from "../voteItem";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import DetailButton from "../detailButton";

function ItemHeader({ vote, setShowVoteDetail }) {
  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral-300">
        <span className="text-textPrimary">{vote.proposal?.title}</span>
        <DetailButton onClick={() => setShowVoteDetail(vote)} />
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <Gov2ReferendaTag
          state={vote.proposal?.state?.name}
          args={getGov2ReferendumStateArgs(vote.proposal?.state)}
        />
      </div>
    </div>
  );
}

export default function OpenGovVoteListItem({ vote, setShowVoteDetail }) {
  return (
    <ListCard>
      <ItemHeader vote={vote} setShowVoteDetail={setShowVoteDetail} />
      <div className="mt-[24px]">
        <VoteItem vote={vote} />
      </div>
    </ListCard>
  );
}
