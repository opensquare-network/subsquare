import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export default function SummaryHeaderContent({ summary }) {
  const items = [
    {
      title: "TRACK",
      content: <CountSummaryContent count={summary?.trackReferendaCounts?.length || 0} />,
    },
    {
      title: "REFERENDUM",
      content: <CountSummaryContent count={summary?.totalReferendaCount || 0} />,
    },
  ];

  return <SummaryItems items={items} />;
}
