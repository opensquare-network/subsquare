import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import useSubMyReferendaVote from "next-common/hooks/referenda/useSubMyReferendaVote";
import { usePost } from "next-common/context/post";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { normalizeOnchainVote } from "next-common/utils/vote";

export default function MyVote() {
  const pageType = useDetailType();
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const trackId = post?.track;
  const realAddress = useRealAddress();
  const { vote: onchainVote } = useSubMyReferendaVote(
    trackId,
    referendumIndex,
    realAddress,
  );

  let hasOnchainVote = false;
  if (onchainVote) {
    hasOnchainVote = true;
    votes = normalizeOnchainVote(onchainVote);
  }

  if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
    return null;
  }

  return <MyVoteCommon votes={votes} hasOnchainVote={hasOnchainVote} />;
}
