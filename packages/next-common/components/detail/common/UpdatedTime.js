import React from "react";
import useDuration from "../../../utils/hooks/useDuration";
import Info from "../../styled/info";
import { usePost } from "../../../context/post";
import { SystemActivity } from "@osn/icons/subsquare";

export default function UpdatedTime() {
  const post = usePost();
  const postUpdatedTime = Math.max(
    new Date(post.createdAt),
    new Date(post.updatedAt),
  );

  if (!postUpdatedTime) {
    return null;
  }

  const duration = useDuration(postUpdatedTime);
  return (
    <Info>
      <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
      <span>{duration}</span>
    </Info>
  );
}
