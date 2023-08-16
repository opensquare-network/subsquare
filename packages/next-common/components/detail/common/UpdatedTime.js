import React from "react";
import useDuration from "../../../utils/hooks/useDuration";
import Info from "../../styled/info";
import UpdateIcon from "../../../assets/imgs/icons/line-chart.svg";
import { usePost } from "../../../context/post";

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
      <UpdateIcon />
      <span>{duration}</span>
    </Info>
  );
}
