import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import { useCallback } from "react";
import { getContentField } from "next-common/utils/sima/utils";
import nextApi from "next-common/services/nextApi";
import {
  isLinkedToOffChainDiscussion,
  isLinkedToSimaDiscussion,
} from "./common";
import { useOffChainProvideContext } from "next-common/noSima/actions/provideContext";
import getProposalIndexer from "../utils/getProposalIndexer";
import getDetailPageCategory from "../utils/getDetailPageCategoryFromPostType";

export function useProvideContext() {
  const signSimaMessage = useSignSimaMessage();
  const offChainDiscussionProvideContext = useOffChainProvideContext();

  return useCallback(
    async (post, { title, content, contentType, bannerCid, labels }, real) => {
      if (isLinkedToOffChainDiscussion(post)) {
        return await offChainDiscussionProvideContext(post, {
          title,
          content,
          contentType,
          bannerCid,
          labels,
        });
      }

      if (isLinkedToSimaDiscussion(post)) {
        throw new Error("Editing SIMA discussion is not support");
      }

      const indexer = getProposalIndexer(post);
      const entity = {
        action: "provide_context",
        indexer,
        title,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
        real,
      };
      const data = await signSimaMessage(entity);

      const type = getDetailPageCategory(post);
      return await nextApi.post(`sima/${type}`, data);
    },
    [signSimaMessage, offChainDiscussionProvideContext],
  );
}
