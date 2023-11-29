import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ReferendaVoteTag from "./referendaVoteTag";

export default function VoteTag() {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return <ReferendaVoteTag />;
  }

  return null;
}
