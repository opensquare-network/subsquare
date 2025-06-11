import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import {
  checkSimaDataSource,
  isLinkedToOffChainDiscussion,
  isLinkedToSimaDiscussion,
} from "./common";
import {
  useOffChainCommentUpVote,
  useOffChainPostUpVote,
} from "next-common/noSima/actions/upVote";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";
import getProposalIndexer from "../utils/getProposalIndexer";

export function getDiscussionUpVoteEntity(cid) {
  return {
    action: "upvote",
    cid,
    timestamp: Date.now(),
  };
}

export function getProposalUpVoteEntity(indexer) {
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
      checkSimaDataSource(post);

      const entity = getDiscussionUpVoteEntity(post.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/reactions`, data);
    },
    [signSimaMessage],
  );
}

export function useProposalUpVote() {
  const signSimaMessage = useSignSimaMessage();
  const upVoteDiscussion = useDiscussionUpVote();
  const upVoteOffChainPost = useOffChainPostUpVote();

  return useCallback(
    async (post) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await upVoteOffChainPost(post);
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await upVoteDiscussion(post.refToPost);
      }

      const indexer = getProposalIndexer(post);
      const entity = getProposalUpVoteEntity(indexer);
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(`sima/${type}/${indexer.id}/reactions`, data);
    },
    [signSimaMessage, upVoteDiscussion, upVoteOffChainPost],
  );
}

export function useDiscussionCommentUpVote() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, comment) => {
      checkSimaDataSource(comment);

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
  const upVoteDiscussionComment = useDiscussionCommentUpVote();
  const upVoteOffChainComment = useOffChainCommentUpVote();

  return useCallback(
    async (post, comment) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await upVoteOffChainComment(post, comment);
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await upVoteDiscussionComment(post.refToPost, comment);
      }

      if (comment.dataSource !== "sima") {
        return await upVoteOffChainComment(post, comment);
      }

      const indexer = getProposalIndexer(post);
      const entity = getDiscussionUpVoteEntity(comment.cid);
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage, upVoteDiscussionComment, upVoteOffChainComment],
  );
}
