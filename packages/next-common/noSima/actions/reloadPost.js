import { useDetailType } from "next-common/context/page";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useCallback } from "react";

export function useReloadPost() {
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const post = usePost();

  return useCallback(async () => {
    return await fetchAndUpdatePost(postDispatch, type, post._id);
  }, [type, post, postDispatch]);
}
