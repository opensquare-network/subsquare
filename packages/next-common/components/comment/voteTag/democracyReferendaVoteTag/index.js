import {
  nestedVotesSelector,
  allVotesSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import { useComment } from "../../context";
import { useMemo } from "react";
import { SplitVoteTag, StandardVoteTag } from "../referendaVoteTag";
import { useGetAddressVotesDataFn } from "next-common/hooks/useAddressVotesData";
import { isSameAddress } from "next-common/utils";

export default function DemocracyReferendaVoteTag() {
  const comment = useComment();
  const allVotes = useSelector(allVotesSelector);
  const nestedVotes = useSelector(nestedVotesSelector);
  const getAddressVotesData = useGetAddressVotesDataFn();

  const user = comment?.author;
  const votes = useMemo(
    () =>
      (allVotes || []).filter((item) =>
        isSameAddress(item.account, user?.address),
      ),
    [allVotes, user?.address],
  );

  const votesData = getAddressVotesData(user?.address);

  if (!votesData) {
    return null;
  }

  if (votesData.isStandard || votesData.isDelegating) {
    return <StandardVoteTag vote={votesData} nestedVotes={nestedVotes} />;
  } else if (votesData.isSplit) {
    return <SplitVoteTag votes={votes} />;
  }

  return null;
}
