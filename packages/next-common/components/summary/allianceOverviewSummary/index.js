import { usePageProps } from "next-common/context/page";
import ActiveValue from "../overviewSummary/activeValue";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function AllianceOverviewSummary() {
  const { summary } = usePageProps();

  const {
    fellowshipReferenda,
    ambassadorReferenda,
    allianceMotions,
    allianceAnnouncements,
  } = summary ?? {};

  return (
    <SummaryLayout>
      <SummaryItem title="Fellowship Referenda">
        <ActiveValue
          href={"/fellowship"}
          tooltip="Active fellowship referenda"
          value={fellowshipReferenda?.active || 0}
        />
      </SummaryItem>
      <SummaryItem title="Ambassador Referenda">
        <ActiveValue
          href={"/ambassador"}
          tooltip="Active ambassador referenda"
          value={ambassadorReferenda?.active || 0}
        />
      </SummaryItem>

      <SummaryItem title="Alliance Motions">
        <ActiveValue
          href={"/alliance/motions"}
          tooltip="Active motions"
          value={allianceMotions?.active || 0}
        />
      </SummaryItem>
      <SummaryItem title="Alliance Announcements">
        <ActiveValue
          href={"/alliance/announcements"}
          tooltip="Active announcements"
          value={allianceAnnouncements?.active || 0}
        />
      </SummaryItem>
    </SummaryLayout>
  );
}
