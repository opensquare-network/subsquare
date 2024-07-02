import { useDetailType } from "next-common/context/page";
import {
  POST_UPDATE_ACTION,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";
import useProposalIndexerBuilder from "../hooks/useProposalIndexerBuilder";

export function useReloadDiscussionPost() {
  const post = usePost();
  const postDispatch = usePostDispatch();

  return useCallback(async () => {
    const { result: newPost } = await nextApi.fetch(
      `sima/discussions/${post.cid}`,
    );

    if (newPost) {
      postDispatch({
        type: POST_UPDATE_ACTION,
        post: newPost,
      });
    }
  }, [post, postDispatch]);
}

export function useReloadProposalPost() {
  const post = usePost();
  const postDispatch = usePostDispatch();
  const type = useDetailType();
  const getProposalIndexer = useProposalIndexerBuilder();

  return useCallback(async () => {
    const indexer = getProposalIndexer(post);
    const { result: newPost } = await nextApi.fetch(
      `sima/${type}/${indexer.id}`,
    );

    if (newPost) {
      postDispatch({
        type: POST_UPDATE_ACTION,
        post: newPost,
      });
    }
  }, [type, post, postDispatch, getProposalIndexer]);
}
