import {
  allNestedVotesSelector,
  allVotesSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import { useComment } from "../../context";
import { useMemo } from "react";
import { SplitVoteTag, StandardVoteTag } from "../referendaVoteTag";

export default function DemocracyReferendaVoteTag() {
  const comment = useComment();
  const allVotes = useSelector(allVotesSelector);
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const user = comment?.author;
  const votes = useMemo(
    () => (allVotes || []).filter((item) => item.account === user?.address),
    [allVotes, user?.address],
  );

  if (votes.length === 0) {
    return null;
  }

  const firstVoteItem = votes[0];

  if (firstVoteItem.isStandard || firstVoteItem.isDelegating) {
    return (
      <StandardVoteTag vote={firstVoteItem} allNestedVotes={allNestedVotes} />
    );
  } else if (firstVoteItem.isSplit) {
    return <SplitVoteTag votes={votes} />;
  }

  return null;
}
