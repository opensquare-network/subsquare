import nextApi from "next-common/services/nextApi";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { getContentField } from "next-common/utils/sima/utils";
import { useCallback } from "react";
import getProposalIndexer from "next-common/sima/utils/getProposalIndexer";
import getDetailPageCategory from "next-common/sima/utils/getDetailPageCategoryFromPostType";

function getReferendumIndex(post) {
  return (
    post?.referendumIndex ??
    post?.refToPost?.referendumIndex ??
    post?.onchainData?.referendumIndex
  );
}

export function useAddDiscussionAppendant() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (postCid, content, contentType, real) => {
      const entity = {
        action: "append_discussion",
        CID: postCid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/discussions/${postCid}/appendants`, data);
    },
    [signSimaMessage],
  );
}

export function useAddReferendaAppendant() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, content, contentType, real) => {
      const entity = {
        action: "append_proposal",
        indexer: getProposalIndexer(post),
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(
        `sima/${type}/${getReferendumIndex(post)}/appendants`,
        data,
      );
    },
    [signSimaMessage],
  );
}

export function useReplaceReferendaAppendant() {
  const signSimaMessage = useSignSimaMessage();

  return useCallback(
    async (post, appendant, content, contentType, real) => {
      const entity = {
        action: "replace_appendant",
        cid: appendant.cid,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);
      const type = getDetailPageCategory(post);
      return await nextApi.post(
        `sima/${type}/${getReferendumIndex(post)}/appendants/${appendant.cid}`,
        data,
      );
    },
    [signSimaMessage],
  );
}
