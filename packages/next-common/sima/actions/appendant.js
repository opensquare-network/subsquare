import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";

export function useAddDiscussionAppendant() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (postCid, content, contentType, real) => {
      const entity = {
        action: "append_discussion",
        CID: postCid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${postCid}/appendants`, data);
    },
    [signSimaMessage],
  );
}
