import React, { createContext, useContext, useEffect, useReducer } from "react";

const PostContext = createContext(null);
const PostDispatchContext = createContext(null);
export const POST_UPDATE_ACTION = "UPDATE";

export function PostProvider({ children, post }) {
  const [detail, dispatch] = useReducer(postReducer, post);
  useEffect(() => {
    dispatch({
      type: POST_UPDATE_ACTION,
      post,
    });
  }, [post]);

  return (
    <PostContext.Provider value={detail}>
      <PostDispatchContext.Provider value={dispatch}>
        {children}
      </PostDispatchContext.Provider>
    </PostContext.Provider>
  );
}

function postReducer(post, action) {
  if (action.type !== POST_UPDATE_ACTION) {
    throw new Error(`Unknown post action: ${action.type}`);
  }

  return action.post;
}

export function usePostDispatch() {
  return useContext(PostDispatchContext);
}

export function usePost() {
  return useContext(PostContext);
}

export function usePostOnChainData() {
  const post = useContext(PostContext);
  if (!post?.onchainData) {
    throw new Error("onchainData not existed");
  }

  return post?.onchainData;
}

export function usePostState() {
  const post = useContext(PostContext);
  return post?.onchainData?.state?.state || post?.onchainData?.state?.name;
}

export function useOnchainData() {
  const post = useContext(PostContext);
  if (!post.onchainData) {
    throw new Error("No on chain data when call `useOnchainData`");
  }
  return post.onchainData;
}

export function useTimelineData() {
  const onchainData = useOnchainData();
  return onchainData.timeline || [];
}
