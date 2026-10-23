import React from "react";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import EditedHistoryDropdown, {
  PlainEditedMarker,
} from "next-common/sima/components/editedHistory/editedHistoryDropdown";

export default function PostEditedMarker({ post, className }) {
  const detailType = useDetailType();
  const cid = post?.cid || post?.refToPost?.cid;
  const dataSource = post?.dataSource || post?.refToPost?.dataSource;
  // "post" (singular) is the linked discussion collection type.
  const isLinkedDiscussion = post?.refToPost?.postType === "post";

  if (
    !cid ||
    dataSource !== "sima" ||
    detailType === detailPageCategory.POST ||
    isLinkedDiscussion
  ) {
    return <PlainEditedMarker className={className} />;
  }

  return (
    <EditedHistoryDropdown
      historyUrl={`sima/proposals/${cid}/history`}
      popupTitle="Proposal Revision"
      showTitle
      prefetch
      firstVersionLabel="Original"
      firstVersionTimeLabel="Original at"
      className={className}
    />
  );
}
