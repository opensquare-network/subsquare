import React from "react";
import Summary from "next-common/components/summary/v2/base";

export default function AllianceOverviewSummary({ summaryData }) {
  const {
    activeAllianceMotionsCount,
    activeAllianceAnnouncementsCount,
    activeFellowshipReferendaCount,
  } = summaryData;
  return (
    <Summary
      items={[
        { title: "Fellowship", content: activeFellowshipReferendaCount },
        { title: "Motions", content: activeAllianceMotionsCount || 0 },
        {
          title: "Announcements",
          content: activeAllianceAnnouncementsCount || 0,
        },
      ]}
    />
  );
}
