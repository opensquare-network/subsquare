import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import { toApiType } from "next-common/utils/viewfuncs";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export function useOffChainProvideContext() {
  const type = useDetailType();
  const { ensureLogin } = useEnsureLogin();

  return useCallback(
    async (post, { title, content, contentType, bannerCid, labels }) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      const url = `${toApiType(type)}/${post._id}`;
      return await nextApi.patch(url, {
        title,
        content,
        contentType,
        bannerCid,
        labels,
      });
    },
    [type, ensureLogin],
  );
}
