import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ReferendaVoteTag from "./referendaVoteTag";
import DemocracyReferendaVoteTag from "./democracyReferendaVoteTag";
import { isKintsugiChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import KintDemocracyReferendaVoteTag from "./kintDemocracyReferendaVoteTag";
import FellowshipReferendaVoteTag from "./fellowshipReferendaVoteTag";

export default function VoteTag() {
  const type = useDetailType();
  const chain = useChain();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return <ReferendaVoteTag />;
  } else if (type === detailPageCategory.DEMOCRACY_REFERENDUM) {
    if (isKintsugiChain(chain)) {
      return <KintDemocracyReferendaVoteTag />;
    }
    return <DemocracyReferendaVoteTag />;
  } else if (type === detailPageCategory.FELLOWSHIP_REFERENDUM) {
    return <FellowshipReferendaVoteTag />;
  }

  return null;
}
