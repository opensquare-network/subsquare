import { createSelector } from "@reduxjs/toolkit";
import { userSelector } from "../reducers/userSlice";
import { usePost, usePostType } from "../../context/post";

export const isPostAuthorSelector = createSelector(userSelector, (user) => {
  if (!user) {
    return false;
  }

  const type = usePostType();
  const post = usePost();
  if (type === "post") {
    return post.author?.username === user.username;
  }

  return post?.authors?.includes(user.address);
})

// Show has the login user giver thumbs up to the post
export const thumbsUpSelector = createSelector(userSelector, (user) => {
  if (!user) {
    return false
  }

  const post = usePost();
  return post.reactions?.findIndex((r) => r.user?.username === user.username) > -1;
})
