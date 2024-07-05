import { useDetailType } from "next-common/context/page";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";
import { useCallback } from "react";
import { getContentField } from "next-common/utils/sima/utils";
import nextApi from "next-common/services/nextApi";
import {
  isLinkedToOffChainDiscussion,
  isLinkedToSimaDiscussion,
} from "./common";
import { useOffChainProvideContext } from "next-common/noSima/actions/provideContext";

export function useProvideContext() {
  const signSimaMessage = useSignSimaMessage();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();
  const offChainDiscussionProvideContext = useOffChainProvideContext();

  return useCallback(
    async (post, { title, content, contentType, bannerCid, labels }) => {
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

      const indexer = getProposalIndexer(post.onchainData);
      const entity = {
        action: "provide_context",
        indexer,
        title,
        ...getContentField(content, contentType),
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);
      return await nextApi.post(`sima/${type}`, data);
    },
    [
      type,
      signSimaMessage,
      getProposalIndexer,
      offChainDiscussionProvideContext,
    ],
  );
}
