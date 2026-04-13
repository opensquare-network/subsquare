import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";

export function useMarkSpamComment() {
  return useCallback(async (comment) => {
    return await nextApi.post(`comments/${comment._id}/spam`);
  }, []);
}
