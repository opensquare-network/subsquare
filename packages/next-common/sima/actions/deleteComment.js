import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import { checkSimaDataSource, isLinkedToSimaDiscussion } from "./common";
import nextApi from "next-common/services/nextApi";
import getProposalIndexer from "../utils/getProposalIndexer";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";

export function useDeleteDiscussionComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, comment) => {
      checkSimaDataSource(post);

      const entity = {
        action: "delete_comment",
        cid: comment.cid,
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await nextApi.delete(
        `sima/discussions/${post.cid}/comments/${comment.cid}`,
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useDeleteProposalComment() {
  const signSimaMessage = useSignSimaMessage();

  const deleteDiscussionComment = useDeleteDiscussionComment();
  return useCallback(
    async (post, comment) => {
      if (isLinkedToSimaDiscussion(post)) {
        return await deleteDiscussionComment(post, comment);
      }

      const entity = {
        action: "delete_comment",
        cid: comment.cid,
        timestamp: Date.now(),
      };
      const indexer = getProposalIndexer(post);
      const data = await signSimaMessage(entity);
      return await nextApi.delete(
        `sima/${getDetailPageCategory(post)}/${indexer.id}/comments/${
          comment.cid
        }`,
        data,
      );
    },
    [deleteDiscussionComment, signSimaMessage],
  );
}
