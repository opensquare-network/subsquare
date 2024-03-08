import { isNil } from "lodash-es";
import { usePost } from "../../../../context/post";
import Info from "../../../styled/info";
import React from "react";

export default function CommentsMeta() {
  const post = usePost();
  const noCommentsCount =
    isNil(post.commentsCount) && isNil(post.polkassemblyCommentsCount);
  const commentsCount =
    (post.commentsCount || 0) + (post.polkassemblyCommentsCount || 0);

  if (noCommentsCount || commentsCount < 0) {
    return null;
  }

  return <Info>{`${commentsCount} Comments`}</Info>;
}
