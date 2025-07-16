import React from "react";
import { usePost } from "../../../context/post";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";
import { PostItemTime } from "next-common/components/postList/common";

export default function UpdatedTime() {
  const post = usePost();

  const postUpdatedTime = getPostLastActivityAt(post);
  if (!postUpdatedTime) {
    return null;
  }

  return <PostItemTime data={{ ...post, time: postUpdatedTime }} />;
}
