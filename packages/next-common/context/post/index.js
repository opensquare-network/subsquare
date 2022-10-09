import { createContext, useContext, useReducer, useState } from "react";

const PostContext = createContext(null);
const PostDispatchContext = createContext(null);
const PostTypeContext = createContext(null);
export const POST_UPDATE_ACTION = 'UPDATE';

export function PostProvider({ children, post, type }) {
  const [detail, dispatch] = useReducer(postReducer, post);

  return (
    <PostContext.Provider value={ detail }>
      <PostDispatchContext.Provider value={ dispatch }>
        <PostTypeContext.Provider value={ type }>
          { children }
        </PostTypeContext.Provider>
      </PostDispatchContext.Provider>
    </PostContext.Provider>
  )
}

function postReducer(post, action) {
  if (action.type !== POST_UPDATE_ACTION) {
    throw new Error(`Unknown post action: ${ action.type }`)
  }

  return post;
}

export function usePostDispatch() {
  return useContext(PostDispatchContext);
}

export function usePost() {
  return useContext(PostContext);
}

export function usePostType() {
  return useContext(PostTypeContext);
}

export function usePostState() {
  const post = useContext(PostContext);
  return post?.onchainData?.state?.state;
}
