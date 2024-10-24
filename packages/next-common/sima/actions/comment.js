import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";
import {
  checkSimaDataSource,
  isLinkedToOffChainDiscussion,
  isLinkedToSimaDiscussion,
} from "./common";
import {
  useCreateOffChainComment,
  useCreateOffChainCommentReply,
} from "next-common/noSima/actions/comment";
import getProposalIndexer from "../utils/getProposalIndexer";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";

export function useCreateDiscussionComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, content, contentType, real) => {
      checkSimaDataSource(post);

      const entity = {
        action: "comment",
        cid: post.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/comments`, data);
    },
    [signSimaMessage],
  );
}

export function useCreateProposalComment() {
  const signSimaMessage = useSignSimaMessage();
  const createDiscussionComment = useCreateDiscussionComment();
  const createOffChainComment = useCreateOffChainComment();

  return useCallback(
    async (post, content, contentType, real) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await createOffChainComment(post, content, contentType);
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await createDiscussionComment(
          post.refToPost,
          content,
          contentType,
          real,
        );
      }

      const indexer = getProposalIndexer(post);
      const entity = {
        action: "comment",
        indexer,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);

      const type = getDetailPageCategory(post);
      return await nextApi.post(`sima/${type}/${indexer.id}/comments`, data);
    },
    [signSimaMessage, createDiscussionComment, createOffChainComment],
  );
}

export function useCreateDiscussionCommentReply() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, comment, content, contentType, real) => {
      checkSimaDataSource(comment);

      const entity = {
        action: "comment",
        cid: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
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

export function useCreateProposalCommentReply() {
  const signSimaMessage = useSignSimaMessage();
  const createDiscussionCommentReply = useCreateDiscussionCommentReply();
  const createOffChainCommentReply = useCreateOffChainCommentReply();

  return useCallback(
    async (post, comment, content, contentType, real) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await createOffChainCommentReply(
          post,
          comment,
          content,
          contentType,
        );
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await createDiscussionCommentReply(
          post.refToPost,
          comment,
          content,
          contentType,
          real,
        );
      }

      if (comment.dataSource !== "sima") {
        return await createOffChainCommentReply(
          post,
          comment,
          content,
          contentType,
        );
      }

      const indexer = getProposalIndexer(post);
      const entity = {
        action: "comment",
        cid: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);

      const type = getDetailPageCategory(post);

      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/replies`,
        data,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      signSimaMessage,
      getProposalIndexer,
      createDiscussionCommentReply,
      createOffChainCommentReply,
    ],
  );
}
