import React from "react";
import Summary from "next-common/components/summary/summaryBase";

export default function AllianceOverviewSummary({ summaryData }) {
  const { activeAllianceMotionsCount, activeAllianceAnnouncementsCount, activeFellowshipReferendaCount } =
    summaryData;
  return (
    <Summary
      description="Active proposal numbers of various governance processes."
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
