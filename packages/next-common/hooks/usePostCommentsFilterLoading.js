import { useContextApi } from "next-common/context/api";
import { usePostCommentsFilterParams } from "./usePostCommentsFilterParams";

export default function usePostCommentsFilterLoading() {
  const api = useContextApi();
  const [filterParams] = usePostCommentsFilterParams();

  if (filterParams.hide_0) {
    return !api;
  }

  return false;
}
