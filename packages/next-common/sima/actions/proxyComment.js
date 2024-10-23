import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";
import { checkSimaDataSource } from "./common";

export function useCreateDiscussionProxyComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (realAddress, post, content, contentType) => {
      checkSimaDataSource(post);

      const entity = {
        action: "comment",
        cid: post.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real: {
          address: realAddress,
          section: "proxy",
        },
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/comments`, data);
    },
    [signSimaMessage],
  );
}

export function useCreateDiscussionCommentProxyReply() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (realAddress, post, comment, content, contentType) => {
      checkSimaDataSource(comment);

      const entity = {
        action: "comment",
        cid: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real: {
          address: realAddress,
          section: "proxy",
        },
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${comment.cid}/replies`,
        data,
      );
    },
    [signSimaMessage],
  );
}
