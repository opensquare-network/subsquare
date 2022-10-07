import { createSelector } from "@reduxjs/toolkit";
import { detailTypeSelector, postSelector } from "../reducers/postSlice";
import { userSelector } from "../reducers/userSlice";

export const isPostAuthorSelector = createSelector(postSelector, detailTypeSelector, userSelector, (post, type, user) => {
  if (!user) {
    return false;
  }

  if (type === "post") {
    return post.author?.username === user.username;
  }

  return post?.authors?.includes(user.address);
})

// Show has the login user giver thumbs up to the post
export const thumbsUpSelector = createSelector(postSelector, userSelector, (post, user) => {
  if (!user) {
    return false
  }

  return post.reactions?.findIndex((r) => r.user?.username === user.username) > -1;
})
