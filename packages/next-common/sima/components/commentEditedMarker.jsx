import React from "react";
import { useComment } from "next-common/components/comment/context";
import { useCommentActions } from "next-common/sima/context/commentActions";
import CommentEditedHistoryDropdown from "next-common/sima/components/commentEditedHistoryDropdown";

function PlainCommentEditedMarker() {
  return <div className="mt-2 text12Medium text-textTertiary">Edited</div>;
}

export default function CommentEditedMarker() {
  const comment = useComment();
  const { supportSima } = useCommentActions();

  const hasHistory =
    supportSima &&
    comment?.dataSource === "sima" &&
    !!comment?.cid &&
    !!comment?.hasEditHistory;

  if (!hasHistory) {
    return <PlainCommentEditedMarker />;
  }

  return <CommentEditedHistoryDropdown commentCid={comment.cid} />;
}
