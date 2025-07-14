import businessCategory from "next-common/utils/consts/business/category";
import PostListMyDemocracyReferendaVoteMark from "./democracy";
import PostListMyReferendaVoteMark from "./referenda";

export default function PostListMyVoteMark({ data, category }) {
  if (category === businessCategory.democracyReferenda) {
    return <PostListMyDemocracyReferendaVoteMark data={data} />;
  }

  if (category === businessCategory.openGovReferenda) {
    return <PostListMyReferendaVoteMark data={data} />;
  }

  return null;
}
