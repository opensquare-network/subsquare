import React from "react";
import Info from "../../styled/info";
import { usePost } from "../../../context/post";
import { SystemActivity } from "@osn/icons/subsquare";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

export default function UpdatedTime() {
  const post = usePost();
  const postUpdatedTime = Math.max(
    new Date(post.createdAt),
    new Date(post.updatedAt),
  );

  if (!postUpdatedTime) {
    return null;
  }

  const timeAgo = formatTimeAgo(postUpdatedTime);
  return (
    <Info>
      <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
      <span>{timeAgo}</span>
    </Info>
  );
}
