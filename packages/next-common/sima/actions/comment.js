import { useDetailType } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";

export function useGetDiscussionComment() {
  return useCallback(async (post, commentCid) => {
    return await nextApi.fetch(
      `sima/discussions/${post.cid}/comments/${commentCid}`,
    );
  }, []);
}

export function useGetProposalComment() {
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();

  return useCallback(
    async (post, commentCid) => {
      const indexer = getProposalIndexer(post);
      return await nextApi.fetch(
        `sima/${type}/${indexer.id}/comments/${commentCid}`,
      );
    },
    [type, getProposalIndexer],
  );
}

export function useCreateDiscussionComment() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, content, contentType) => {
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

  return useCallback(
    async (post, content, contentType) => {
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
    [type, signSimaMessage, getProposalIndexer],
  );
}

export function useCreateDiscussionCommentReply() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, comment, content, contentType) => {
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

  return useCallback(
    async (post, comment, content, contentType) => {
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
    [type, signSimaMessage],
  );
}
