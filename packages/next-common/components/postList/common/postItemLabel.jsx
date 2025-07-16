import React from "react";
import { MobileHiddenInfo } from "../styled";
import PostLabels from "next-common/components/postLabels";

export default function PostItemLabel({ labels }) {
  if (!labels?.length) {
    return null;
  }
  return (
    <MobileHiddenInfo>
      <PostLabels labels={labels} />
    </MobileHiddenInfo>
  );
}
