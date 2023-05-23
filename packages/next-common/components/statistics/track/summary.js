import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export default function TrackReferendumSummary({ summary }) {
  const items = [
    {
      title: "REFERENDA",
      content: <CountSummaryContent count={summary?.referendumCount} />,
    },
  ];

  return <SummaryItems items={items} />;
}
