import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import { checkSimaDataSource, isLinkedToOffChainDiscussion } from "./common";
import { useOffChainCommentDownVote } from "next-common/noSima/actions/downVote";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";
import getProposalIndexer from "../utils/getProposalIndexer";

function getDownVoteEntity(cid) {
  return {
    action: "downvote",
    cid,
    timestamp: Date.now(),
  };
}

export function useDiscussionCommentDownVote() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, comment) => {
      checkSimaDataSource(comment);

      const entity = getDownVoteEntity(comment.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useProposalCommentDownVote() {
  const signSimaMessage = useSignSimaMessage();
  const downVoteOffChainComment = useOffChainCommentDownVote();

  return useCallback(
    async (post, comment) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await downVoteOffChainComment(post, comment);
      }

      if (comment.dataSource !== "sima") {
        return await downVoteOffChainComment(post, comment);
      }

      const indexer = getProposalIndexer(post);
      const entity = getDownVoteEntity(comment.cid);
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage, downVoteOffChainComment],
  );
}
