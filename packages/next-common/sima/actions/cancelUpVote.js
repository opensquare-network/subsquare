import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";

function getCancelUpVoteEntity(reactionCid) {
  return {
    action: "cancel_upvote",
    cid: reactionCid,
    timestamp: Date.now(),
  };
}

export function useDiscussionCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  return useCallback(
    async (post, reactionCid) => {
      const entity = getCancelUpVoteEntity(reactionCid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
    },
    [signSimaMessage],
  );
}

export function useCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  return useCallback(
    async (comment, reactionCid) => {
      const entity = getCancelUpVoteEntity(reactionCid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/comments/${comment.cid}/reactions`, data);
    },
    [signSimaMessage],
  );
}

export function useProposalCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  return useCallback(
    async (post, reactionCid) => {
      const entity = getCancelUpVoteEntity(reactionCid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/${type}/${post.indexer.id}/reactions`,
        data,
      );
    },
    [type, signSimaMessage],
  );
}
