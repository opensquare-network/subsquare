import { myVotedPostsSelector } from "next-common/store/reducers/myVotesSlice";
import { useSelector } from "react-redux";

export default function useVotedPost(referendumIndex) {
  const posts = useSelector(myVotedPostsSelector);
  return posts?.find((item) => item.referendumIndex === referendumIndex);
}
