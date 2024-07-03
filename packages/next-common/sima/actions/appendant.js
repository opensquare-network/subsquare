import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";

export function useAddDiscussionAppendant() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, content, contentType) => {
      const entity = {
        action: "append_discussion",
        CID: post.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/appendants`,
        data,
      );
    },
    [signSimaMessage],
  );
}
