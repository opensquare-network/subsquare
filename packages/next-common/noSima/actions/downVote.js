import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";

export function useOffChainCommentDownVote() {
  const { ensureLogin } = useEnsureLogin();
  const type = useDetailType();

  return useCallback(
    async (post, comment) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.put(`comments/${comment._id}/reaction`, {
        reaction: 0,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, ensureLogin],
  );
}
