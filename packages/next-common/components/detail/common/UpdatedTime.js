import React from "react";
import useDuration from "../../../utils/hooks/useDuration";
import Info from "../../styled/info";
import UpdateIcon from "../../../assets/imgs/icons/line-chart.svg";
import { usePost } from "../../../context/post";

export default function UpdatedTime() {
  const post = usePost();
  let postUpdatedTime = post.updatedAt;
  if (post.createdAt === post.updatedAt) {
    postUpdatedTime = post?.indexer?.blockTime ?? post.createdAt;
  }

  if (!postUpdatedTime) {
    return null;
  }

  const duration = useDuration(postUpdatedTime);
  return (
    <Info>
      <UpdateIcon />
      <span>{duration}</span>
    </Info>
  );
}
