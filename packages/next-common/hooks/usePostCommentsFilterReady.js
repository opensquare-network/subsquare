import { useContextApi } from "next-common/context/api";
import { usePostCommentsFilterParams } from "./usePostCommentsFilterParams";
import { usePostCommentsMerging } from "./usePostCommentsMerging";

export default function usePostCommentsFilterReady() {
  const [merging] = usePostCommentsMerging();
  const api = useContextApi();
  const [filterParams] = usePostCommentsFilterParams();

  if (filterParams.hide_0) {
    return api && !merging;
  }

  return true;
}
