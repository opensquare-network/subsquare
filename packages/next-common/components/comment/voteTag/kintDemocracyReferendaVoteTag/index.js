import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import { useComment } from "../../context";
import { useMemo } from "react";
import StandardVoteTag from "./standardVoteTag";

export default function KintDemocracyReferendaVoteTag() {
  const comment = useComment();
  const allVotes = useSelector(allVotesSelector);

  const user = comment?.author;
  const vote = useMemo(
    () => (allVotes || []).find((item) => item.account === user?.address),
    [allVotes, user?.address],
  );

  if (!vote) {
    return null;
  }

  return <StandardVoteTag vote={vote} />;
}
