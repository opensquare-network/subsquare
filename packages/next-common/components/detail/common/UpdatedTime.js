import React from "react";
import useDuration from "../../../utils/hooks/useDuration";
import Info from "../../styled/info";
import UpdateIcon from "../../../assets/imgs/icons/line-chart.svg";
import { usePost } from "../../../context/post";

export default function UpdatedTime() {
  const post = usePost();
  let postUpdatedTime = Math.max(
    new Date(post.createdAt || 0),
    new Date(post.updatedAt || 0),
    new Date(post.originalCreatedAt || 0),
    new Date(post.originalUpdatedAt || 0),
  );

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
