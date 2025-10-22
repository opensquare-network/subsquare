import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";

export function useDeleteOffChainComment() {
  return useCallback(async (post, comment) => {
    return await nextApi.delete(`comments/${comment._id}`);
  }, []);
}
