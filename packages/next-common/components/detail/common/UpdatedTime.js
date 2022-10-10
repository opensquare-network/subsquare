import React from "react";
import useDuration from "../../../utils/hooks/useDuration";
import { getPostUpdatedAt } from "../../../utils/viewfuncs/postUpdatedTime";
import Info from "../../styled/info";
import UpdateIcon from "../../../assets/imgs/icons/line-chart.svg";

export default function UpdatedTime({ post }) {
  const postUpdatedTime = getPostUpdatedAt(post);
  if (!postUpdatedTime) {
    return null
  }

  const duration = useDuration(postUpdatedTime);
  return (
    <Info>
      <UpdateIcon />
      <span>{duration}</span>
    </Info>
  )
}
