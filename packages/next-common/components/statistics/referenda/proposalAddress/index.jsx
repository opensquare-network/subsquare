import React, { memo } from "react";
import HeadNotes from "./headNotes";
import StatisticsContent from "./statisticsContent";

function ReferendumStatistics() {
  return (
    <>
      <HeadNotes />
      <StatisticsContent />
    </>
  );
}
export default memo(ReferendumStatistics);
