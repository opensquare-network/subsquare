import { useContextApi } from "next-common/context/api";
import { useSelector } from "react-redux";
import { detailCommentsMergingSelector } from "next-common/store/reducers/detailSlice";
import { useCommittedCommentFilterParams } from "next-common/components/comment/filter/utils";

export default function usePostCommentsFilterReady() {
  const merging = useSelector(detailCommentsMergingSelector);
  const api = useContextApi();
  const [filterParams] = useCommittedCommentFilterParams();

  if (filterParams.hide_0) {
    return api && !merging;
  }

  return true;
}
