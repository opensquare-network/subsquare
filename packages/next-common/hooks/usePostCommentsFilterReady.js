import { useContextApi } from "next-common/context/api";
import { usePostCommentsFilterParams } from "./usePostCommentsFilterParams";
import { useSelector } from "react-redux";
import { detailCommentsMergingSelector } from "next-common/store/reducers/detailSlice";

export default function usePostCommentsFilterReady() {
  const merging = useSelector(detailCommentsMergingSelector);
  const api = useContextApi();
  const [filterParams] = usePostCommentsFilterParams();

  if (filterParams.hide_0) {
    return api && !merging;
  }

  return true;
}
