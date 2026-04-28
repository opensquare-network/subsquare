import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";

export function useOffChainCommentCancelDownVote() {
  const { ensureLogin } = useEnsureLogin();
  const type = useDetailType();

  return useCallback(
    async (post, comment) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.delete(`comments/${comment._id}/reaction`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, ensureLogin],
  );
}
