import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";
import {
  checkSimaDataSource,
  isLinkedToOffChainDiscussion,
  isLinkedToSimaDiscussion,
} from "./common";
import {
  useCreateOffChainComment,
  useCreateOffChainCommentReply,
} from "next-common/noSima/actions/comment";

export function useCreateDiscussionComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, content, contentType) => {
      checkSimaDataSource(post);

      const entity = {
        action: "comment",
        cid: post.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${post.cid}/comments`, data);
    },
    [signSimaMessage],
  );
}

export function useCreateProposalComment() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();
  const createDiscussionComment = useCreateDiscussionComment();
  const createOffChainComment = useCreateOffChainComment();

  return useCallback(
    async (post, content, contentType) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await createOffChainComment(post, content, contentType);
      }

      if (isLinkedToSimaDiscussion(post)) {
        return await createDiscussionComment(
          post.refToPost,
          content,
          contentType,
        );
      }

      const indexer = getProposalIndexer(post);
      const entity = {
        action: "comment",
        indexer,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/${type}/${indexer.id}/comments`, data);
    },
    [
      type,
      signSimaMessage,
      getProposalIndexer,
      createDiscussionComment,
      createOffChainComment,
    ],
  );
}

export function useCreateDiscussionCommentReply() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, comment, content, contentType) => {
      checkSimaDataSource(comment);

      const entity = {
        action: "comment",
        cid: comment.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
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
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();
  const createDiscussionCommentReply = useCreateDiscussionCommentReply();
  const createOffChainCommentReply = useCreateOffChainCommentReply();

  return useCallback(
    async (post, comment, content, contentType) => {
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
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(
        `sima/${type}/${indexer.id}/comments/${comment.cid}/replies`,
        data,
      );
    },
    [
      type,
      signSimaMessage,
      getProposalIndexer,
      createDiscussionCommentReply,
      createOffChainCommentReply,
    ],
  );
}
