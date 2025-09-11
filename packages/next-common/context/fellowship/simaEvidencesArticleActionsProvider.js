import ArticleActionsContext from "next-common/sima/context/articleActions";
import { useProvideContext } from "next-common/sima/actions/provideContext";
import useSignSimaMessage from "next-common/utils/sima/useSignSimaMessage";
import {
  generalIndexer,
  generalBaseApiUrl,
} from "./simaEvidencesCommentActionsProvider";
import { backendApi } from "next-common/services/nextApi";
import { useMyUpVote } from "../post/useMyUpVote";
import { useCallback } from "react";
import { usePost, usePostDispatch } from "../post";
import { fetchAndUpdatePostForUrl } from "../post/update";
import { useGetSimaUserDiscussions } from "next-common/sima/actions/linkPost";

export function useReloadPost() {
  const postDispatch = usePostDispatch();
  const post = usePost();

  return useCallback(async () => {
    const url = `${generalBaseApiUrl(post)}`;
    return await fetchAndUpdatePostForUrl(postDispatch, url);
  }, [post, postDispatch]);
}

export function SimaEvidencesArticleActionsProvider({ children }) {
  const signSimaMessage = useSignSimaMessage();
  const provideContext = useProvideContext();
  const getUserDiscussions = useGetSimaUserDiscussions();
  const reloadPost = useReloadPost();
  const myUpVote = useMyUpVote();

  const actions = {
    supportSima: true,
    provideContext,
    upVote: async (post) => {
      const indexer = generalIndexer(post);
      const entity = {
        indexer,
        action: "upvote",
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);

      return await backendApi.post(
        `${generalBaseApiUrl(post)}/reactions`,
        data,
      );
    },
    cancelUpVote: async (post) => {
      if (!myUpVote) {
        throw new Error("You have no up vote on this post");
      }

      const indexer = generalIndexer(post);
      const entity = {
        indexer,
        action: "cancel_upvote",
        cid: myUpVote.cid,
        timestamp: Date.now(),
      };
      const data = await signSimaMessage(entity);

      return await backendApi.post(
        `${generalBaseApiUrl(post)}/reactions`,
        data,
      );
    },
    reloadPost,
    getUserDiscussions,
  };

  return (
    <ArticleActionsContext.Provider value={actions}>
      {children}
    </ArticleActionsContext.Provider>
  );
}
