import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";
import { useConnectedAccount } from "next-common/context/connectedAccount";

function getCancelUpVoteEntity(reactionCid) {
  return {
    action: "cancel_upvote",
    cid: reactionCid,
    timestamp: Date.now(),
  };
}

export function useDiscussionCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    async (post) => {
      const myUpVote = post.reactions.find(
        (item) => item.proposer === connectedAccount.address,
      );
      if (!myUpVote) {
        throw new Error("You have not upvoted this post");
      }
      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
    },
    [signSimaMessage, connectedAccount],
  );
}

export function useProposalCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    async (post) => {
      const myUpVote = post.reactions.find(
        (item) => item.proposer === connectedAccount.address,
      );
      if (!myUpVote) {
        throw new Error("You have not upvoted this post");
      }

      const indexer = getProposalIndexer(post);
      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/${type}/${indexer.id}/reactions`, data);
    },
    [type, signSimaMessage, getProposalIndexer, connectedAccount],
  );
}

export function useDiscussionCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    async (post, comment) => {
      const myUpVote = comment.reactions.find(
        (item) => item.proposer === connectedAccount.address,
      );
      if (!myUpVote) {
        throw new Error("You have not upvoted this post");
      }

      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage, connectedAccount],
  );
}

export function useProposalCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    async (post, comment) => {
      const myUpVote = comment.reactions.find(
        (item) => item.proposer === connectedAccount.address,
      );
      if (!myUpVote) {
        throw new Error("You have not upvoted this post");
      }

      const indexer = getProposalIndexer(post);
      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [type, signSimaMessage, getProposalIndexer, connectedAccount],
  );
}
