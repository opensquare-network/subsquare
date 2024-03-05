import React from "react";
import CommentIcon from "next-common/assets/imgs/icons/comment.svg";
import { MobileHiddenInfo } from "./styled";

export default function CommentCount({ data }) {
  if (!data) {
    return;
  }

  const commentsCount =
    (data.commentsCount || 0) + (data.polkassemblyCommentsCount || 0);

  return (
    <MobileHiddenInfo>
      <CommentIcon />
      {`${commentsCount}`}
    </MobileHiddenInfo>
  );
}
