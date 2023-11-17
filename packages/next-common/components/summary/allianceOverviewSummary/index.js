import Summary from "next-common/components/summary/v2/base";
import { usePageProps } from "next-common/context/page";

export default function AllianceOverviewSummary() {
  const { summary } = usePageProps();

  const { fellowshipReferenda, allianceMotions, allianceAnnouncements } =
    summary ?? {};

  return (
    <Summary
      items={[
        { title: "Fellowship", content: fellowshipReferenda.active },
        { title: "Motions", content: allianceMotions.active || 0 },
        {
          title: "Announcements",
          content: allianceAnnouncements.active || 0,
        },
      ]}
    />
  );
}
