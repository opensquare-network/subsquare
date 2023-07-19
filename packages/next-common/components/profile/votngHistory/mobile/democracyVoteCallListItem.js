import { ListCard } from "../styled";
import { DemocracyReferendumTag } from "next-common/components/tags/state/democracy";
import { getDemocracyStateArgs } from "next-common/utils/democracy/result";
import VoteItem from "../voteItem";
import dayjs from "dayjs";
import ExplorerLink from "next-common/components/links/explorerLink";
import { normalizeCall } from "../common";
import { useState } from "react";
import DetailButton from "../detailButton";

function ItemHeader({ vote }) {
  const [showDetail, setShowDetail] = useState(false);
  console.log({ showDetail });

  return (
    <div>
      <div className="flex justify-between pb-[12px] border-b border-b-neutral-300">
        <span className="text-textPrimary">{vote.proposal?.title}</span>
        <DetailButton onClick={() => setShowDetail(true)} />
      </div>
      <div className="flex justify-between pt-[12px] items-center">
        <div className="text-textTertiary whitespace-nowrap">
          <ExplorerLink indexer={vote.indexer}>
            {dayjs(vote.indexer.blockTime).format("YYYY-MM-DD hh:mm:ss")}
          </ExplorerLink>
        </div>
        <DemocracyReferendumTag
          state={vote.proposal?.state?.state}
          args={getDemocracyStateArgs(
            vote.proposal?.state,
            vote.proposal?.timeline,
          )}
        />
      </div>
    </div>
  );
}

export default function DemocracyVoteCallListItem({ vote }) {
  return (
    <ListCard>
      <ItemHeader vote={vote} />
      <div className="mt-[24px]">
        <VoteItem vote={normalizeCall(vote)} />
      </div>
    </ListCard>
  );
}
