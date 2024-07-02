import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import { toApiType } from "next-common/utils/viewfuncs";

export function useOffChainProvideContext() {
  const type = useDetailType();

  return useCallback(
    async (post, { title, content, contentType, bannerCid, labels }) => {
      const url = `${toApiType(type)}/${post}`;
      return await nextApi.patch(url, {
        title,
        content,
        contentType,
        bannerCid,
        labels,
      });
    },
    [type],
  );
}
