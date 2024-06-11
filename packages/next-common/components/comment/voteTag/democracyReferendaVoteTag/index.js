import {
  allNestedVotesSelector,
  allVotesSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import { useComment } from "../../context";
import { useMemo } from "react";
import { SplitVoteTag, StandardVoteTag } from "../referendaVoteTag";
import { useGetAddressVotesDataFn } from "next-common/hooks/useAddressVotesData";

export default function DemocracyReferendaVoteTag() {
  const comment = useComment();
  const allVotes = useSelector(allVotesSelector);
  const allNestedVotes = useSelector(allNestedVotesSelector);
  const getAddressVotesData = useGetAddressVotesDataFn();

  const user = comment?.author;
  const votes = useMemo(
    () => (allVotes || []).filter((item) => item.account === user?.address),
    [allVotes, user?.address],
  );

  const votesData = getAddressVotesData(user?.address);

  if (!votesData) {
    return null;
  }

  if (votesData.isStandard || votesData.isDelegating) {
    return <StandardVoteTag vote={votesData} allNestedVotes={allNestedVotes} />;
  } else if (votesData.isSplit) {
    return <SplitVoteTag votes={votes} />;
  }

  return null;
}
