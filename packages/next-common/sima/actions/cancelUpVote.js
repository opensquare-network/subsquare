import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import {
  checkSimaDataSource,
  isLinkedToOffChainDiscussion,
  isLinkedToSimaDiscussion,
  useFindMyUpVote,
} from "./common";
import {
  useOffChainCommentCancelUpVote,
  useOffChainPostCancelUpVote,
} from "next-common/noSima/actions/cancelUpVote";
import getProposalIndexer from "../utils/getProposalIndexer";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";

function getCancelUpVoteEntity(reactionCid) {
  return {
    action: "cancel_upvote",
    cid: reactionCid,
    timestamp: Date.now(),
  };
}

export function useDiscussionCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyUpVote = useFindMyUpVote();

  return useCallback(
    async (post) => {
      checkSimaDataSource(post);

      const myUpVote = findMyUpVote(post?.reactions);
      if (!myUpVote) {
        throw new Error("You have no up vote on this post");
      }

      checkSimaDataSource(myUpVote);

      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
    },
    [signSimaMessage, findMyUpVote],
  );
}

export function useProposalCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyUpVote = useFindMyUpVote();
  const cancelOffChainUpVote = useOffChainPostCancelUpVote();
  const cancelDiscussionUpVote = useDiscussionCancelUpVote();

  return useCallback(
    async (post) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await cancelOffChainUpVote(post);
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await cancelDiscussionUpVote({
          ...post.refToPost,
          reactions: post.reactions,
        });
      }

      const myUpVote = findMyUpVote(post?.reactions);
      if (!myUpVote) {
        throw new Error("You have no up vote on this post");
      }

      if (myUpVote.dataSource !== "sima") {
        return await cancelOffChainUpVote(post);
      }

      const indexer = getProposalIndexer(post);
      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(`sima/${type}/${indexer.id}/reactions`, data);
    },
    [
      signSimaMessage,
      findMyUpVote,
      cancelOffChainUpVote,
      cancelDiscussionUpVote,
    ],
  );
}

export function useDiscussionCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyUpVote = useFindMyUpVote();

  return useCallback(
    async (post, comment) => {
      checkSimaDataSource(comment);

      const myUpVote = findMyUpVote(comment?.reactions);
      if (!myUpVote) {
        throw new Error("You have no up vote on this comment");
      }

      checkSimaDataSource(myUpVote);

      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage, findMyUpVote],
  );
}

export function useProposalCommentCancelUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyUpVote = useFindMyUpVote();
  const cancelDiscussionCommentUpVote = useDiscussionCommentCancelUpVote();
  const cancelOffChainCommentUpVote = useOffChainCommentCancelUpVote();

  return useCallback(
    async (post, comment) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await cancelOffChainCommentUpVote(post, comment);
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await cancelDiscussionCommentUpVote(post.refToPost, comment);
      }

      if (comment.dataSource !== "sima") {
        return await cancelOffChainCommentUpVote(post, comment);
      }

      const myUpVote = findMyUpVote(comment?.reactions);
      if (!myUpVote) {
        throw new Error("You have no up vote on this comment");
      }

      if (myUpVote.dataSource !== "sima") {
        return await cancelOffChainCommentUpVote(post, comment);
      }

      const indexer = getProposalIndexer(post);
      const entity = getCancelUpVoteEntity(myUpVote.cid);
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [
      signSimaMessage,
      cancelOffChainCommentUpVote,
      cancelDiscussionCommentUpVote,
      findMyUpVote,
    ],
  );
}
