import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { toApiType } from "next-common/utils/viewfuncs";

export function useOffChainPostCancelUpVote() {
  const { ensureLogin } = useEnsureLogin();
  const type = useDetailType();

  return useCallback(
    async (post) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.delete(`${toApiType(type)}/${post._id}/reaction`);
    },
    [type, ensureLogin],
  );
}

export function useOffChainCommentCancelUpVote() {
  const { ensureLogin } = useEnsureLogin();
  const type = useDetailType();

  return useCallback(
    async (post, comment) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await await nextApi.delete(`comments/${comment._id}/reaction`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, ensureLogin],
  );
}
