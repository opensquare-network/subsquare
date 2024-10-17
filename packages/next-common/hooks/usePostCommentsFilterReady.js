import { useContextApi } from "next-common/context/api";
import { useCommittedCommentFilterParams } from "next-common/components/comment/filter/utils";
import { usePostCommentsMerging } from "./usePostCommentsMerging";

export default function usePostCommentsFilterReady() {
  const [merging] = usePostCommentsMerging();
  const api = useContextApi();
  const [filterParams] = useCommittedCommentFilterParams();

  if (filterParams.hide_0) {
    return api && !merging;
  }

  return true;
}
