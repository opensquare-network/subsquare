import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";

export default function MyVote() {
  const pageType = useDetailType();
  const allVotes = useSelector(allVotesSelector);
  const votes = useMyVotes(allVotes);

  if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
    return null;
  }

  return <MyVoteCommon votes={votes} />;
}
