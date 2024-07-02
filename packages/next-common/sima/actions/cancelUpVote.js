import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";

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

export function useProposalCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();

  return useCallback(
    async (post, reactionCid) => {
      const indexer = getProposalIndexer(post);
      const entity = getCancelUpVoteEntity(reactionCid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/${type}/${indexer.id}/reactions`, data);
    },
    [type, signSimaMessage, getProposalIndexer],
  );
}

export function useDiscussionCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  return useCallback(
    async (post, commentCid, reactionCid) => {
      const entity = getCancelUpVoteEntity(reactionCid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${commentCid}/reactions`,
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useProposalCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();

  return useCallback(
    async (post, commentCid, reactionCid) => {
      const indexer = getProposalIndexer(post);
      const entity = getCancelUpVoteEntity(reactionCid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${commentCid}/reactions`,
        data,
      );
    },
    [type, signSimaMessage, getProposalIndexer],
  );
}
