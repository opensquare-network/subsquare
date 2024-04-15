import React, { memo } from "react";
import HeadNotes from "./headNotes";
import StatisticsContent from "./statisticsContent";

function ProposalAddress() {
  return (
    <>
      <HeadNotes />
      <StatisticsContent />
    </>
  );
}
export default memo(ProposalAddress);
