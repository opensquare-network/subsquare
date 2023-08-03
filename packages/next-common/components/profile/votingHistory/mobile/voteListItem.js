import { ListCard } from "../styled";
import DetailButton from "next-common/components/detailButton";
import { PostTitle, ReferendumTag, VoteItem } from "../common";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";

function ItemHeader({ vote, isGov2, setShowVoteDetail }) {
  const chain = useChain();
  const isKintsugi = isKintsugiChain(chain);

  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral-300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={vote.proposal?.title}
          isGov2={isGov2}
        />
        {!isKintsugi && (
          <DetailButton onClick={() => setShowVoteDetail(vote)} />
        )}
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <ReferendumTag proposal={vote.proposal} isGov2={isGov2} />
      </div>
    </div>
  );
}

export default function VoteListItem({ vote, isGov2, setShowVoteDetail }) {
  return (
    <ListCard>
      <ItemHeader
        vote={vote}
        isGov2={isGov2}
        setShowVoteDetail={setShowVoteDetail}
      />
      <div className="mt-[24px]">
        <VoteItem vote={vote} />
      </div>
    </ListCard>
  );
}
