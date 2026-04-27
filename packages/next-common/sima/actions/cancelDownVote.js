import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import {
  checkSimaDataSource,
  isLinkedToOffChainDiscussion,
  useFindMyDownVote,
} from "./common";
import { useOffChainCommentCancelDownVote } from "next-common/noSima/actions/cancelDownVote";
import getProposalIndexer from "../utils/getProposalIndexer";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";

function getCancelDownVoteEntity(reactionCid) {
  return {
    action: "cancel_downvote",
    cid: reactionCid,
    timestamp: Date.now(),
  };
}

export function useDiscussionCommentCancelDownVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyDownVote = useFindMyDownVote();

  return useCallback(
    async (post, comment) => {
      checkSimaDataSource(comment);

      const myDownVote = findMyDownVote(comment?.reactions);
      if (!myDownVote) {
        throw new Error("You have no down vote on this comment");
      }

      checkSimaDataSource(myDownVote);

      const entity = getCancelDownVoteEntity(myDownVote.cid);
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/discussions/${post.cid}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage, findMyDownVote],
  );
}

export function useProposalCommentCancelDownVote() {
  const signSimaMessage = useSignSimaMessage();
  const findMyDownVote = useFindMyDownVote();
  const cancelOffChainCommentDownVote = useOffChainCommentCancelDownVote();

  return useCallback(
    async (post, comment) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await cancelOffChainCommentDownVote(post, comment);
      }

      if (comment.dataSource !== "sima") {
        return await cancelOffChainCommentDownVote(post, comment);
      }

      const myDownVote = findMyDownVote(comment?.reactions);
      if (!myDownVote) {
        throw new Error("You have no down vote on this comment");
      }

      if (myDownVote.dataSource !== "sima") {
        return await cancelOffChainCommentDownVote(post, comment);
      }

      const indexer = getProposalIndexer(post);
      const entity = getCancelDownVoteEntity(myDownVote.cid);
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/reactions`,
        data,
      );
    },
    [signSimaMessage, cancelOffChainCommentDownVote, findMyDownVote],
  );
}
