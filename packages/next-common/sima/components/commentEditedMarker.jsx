import React from "react";
import { useComment } from "next-common/components/comment/context";
import { useCommentActions } from "next-common/sima/context/commentActions";
import EditedHistoryDropdown, {
  PlainEditedMarker,
} from "next-common/sima/components/editedHistory/editedHistoryDropdown";

export default function CommentEditedMarker() {
  const comment = useComment();
  const { supportSima } = useCommentActions();

  const hasHistory =
    supportSima &&
    comment?.dataSource === "sima" &&
    !!comment?.cid &&
    !!comment?.hasEditHistory;

  if (!hasHistory) {
    return <PlainEditedMarker className="mt-2" />;
  }

  return (
    <EditedHistoryDropdown
      historyUrl={`sima/comments/${comment.cid}/history`}
      popupTitle="Comment Revision"
      className="mt-2"
    />
  );
}
