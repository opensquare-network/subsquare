import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { toApiType } from "next-common/utils/viewfuncs";

export function useOffChainPostUpVote() {
  const { ensureLogin } = useEnsureLogin();
  const type = useDetailType();

  return useCallback(
    async (post) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.put(
        `${toApiType(type)}/${post._id}/reaction`,
        { reaction: 1 },
        { credentials: "include" },
      );
    },
    [type, ensureLogin],
  );
}

export function useOffChainCommentUpVote() {
  const { ensureLogin } = useEnsureLogin();
  const type = useDetailType();

  return useCallback(
    async (post, comment) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await await nextApi.put(`comments/${comment._id}/reaction`, {
        reaction: 1,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, ensureLogin],
  );
}
