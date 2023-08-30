import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import MyVoteCommon from "next-common/components/myReferendumVote";

export default function MyVote() {
  const pageType = useDetailType();
  const allVotes = useSelector(allVotesSelector);

  if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
    return null;
  }

  return <MyVoteCommon allVotes={allVotes} />;
}
