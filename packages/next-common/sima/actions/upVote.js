import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";

function getDiscussionUpVoteEntity(cid) {
  return {
    action: "upvote",
    cid,
    timestamp: Date.now(),
  };
}

function getProposalUpVoteEntity(indexer) {
  return {
    action: "upvote_proposal",
    indexer,
    timestamp: Date.now(),
  };
}

export function useDiscussionUpVote() {
  const signSimaMessage = useSignSimaMessage();
  return useCallback(
    async (post) => {
      const entity = getDiscussionUpVoteEntity(post.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
    },
    [signSimaMessage],
  );
}

export function useProposalUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();

  return useCallback(
    async (post) => {
      const indexer = getProposalIndexer(post);
      const entity = getProposalUpVoteEntity(indexer);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/${type}/${indexer.id}/reactions`, data);
    },
    [type, getProposalIndexer, signSimaMessage],
  );
}

export function useDiscussionCommentUpVote() {
  const signSimaMessage = useSignSimaMessage();
  return useCallback(
    async (post, comment) => {
      const entity = getDiscussionUpVoteEntity(comment.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useProposalCommentUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();

  return useCallback(
    async (post, comment) => {
      const indexer = getProposalIndexer(post);
      const entity = getDiscussionUpVoteEntity(comment.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [type, getProposalIndexer, signSimaMessage],
  );
}
