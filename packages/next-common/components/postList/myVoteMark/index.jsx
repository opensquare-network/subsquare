import businessCategory from "next-common/utils/consts/business/category";
import PostListMyDemocracyReferendaVoteMark from "./democracy";

export default function PostListMyVoteMark({ data, category }) {
  if (category === businessCategory.democracyReferenda) {
    return <PostListMyDemocracyReferendaVoteMark data={data} />;
  }

  return null;
}
