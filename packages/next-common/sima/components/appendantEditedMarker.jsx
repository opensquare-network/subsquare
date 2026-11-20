import React from "react";
import EditedHistoryDropdown, {
  PlainEditedMarker,
} from "next-common/sima/components/editedHistory/editedHistoryDropdown";

export default function AppendantEditedMarker({ appendant, className }) {
  const cid = appendant?.cid;

  if (!cid || appendant?.dataSource !== "sima") {
    return <PlainEditedMarker className={className} />;
  }

  return (
    <EditedHistoryDropdown
      historyUrl={`sima/appendants/${cid}/history`}
      popupTitle="Appendant Revision"
      prefetch
      className={className}
    />
  );
}
