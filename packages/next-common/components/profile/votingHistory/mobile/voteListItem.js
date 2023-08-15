import { ListCard } from "../styled";
import DetailButton from "next-common/components/detailButton";
import { PostTitle, ReferendumTag, VoteItem } from "../common";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";

function ItemHeader({ vote, setShowVoteDetail }) {
  const chain = useChain();
  const isKintsugi = isKintsugiChain(chain);

  return (
    <div>
      <div className="flex justify-between items-center pb-[12px] border-b border-b-neutral300 gap-x-6">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={vote.proposal?.title}
        />
        {!isKintsugi && (
          <DetailButton onClick={() => setShowVoteDetail(vote)} />
        )}
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <ReferendumTag proposal={vote.proposal} />
      </div>
    </div>
  );
}

export default function VoteListItem({ vote, setShowVoteDetail }) {
  return (
    <ListCard>
      <ItemHeader vote={vote} setShowVoteDetail={setShowVoteDetail} />
      <div className="mt-[24px]">
        <VoteItem vote={vote} />
      </div>
    </ListCard>
  );
}
