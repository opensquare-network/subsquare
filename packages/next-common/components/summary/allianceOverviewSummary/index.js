import Summary from "next-common/components/summary";
import { usePageProps } from "next-common/context/page";
import ActiveValue from "../overviewSummary/activeValue";

export default function AllianceOverviewSummary() {
  const { summary } = usePageProps();

  const { fellowshipReferenda, allianceMotions, allianceAnnouncements } =
    summary ?? {};

  return (
    <Summary
      items={[
        {
          title: "Fellowship Referenda",
          content: (
            <ActiveValue
              href={"/fellowship"}
              tooltip="Active referenda"
              value={fellowshipReferenda?.active || 0}
            />
          ),
        },
        {
          title: "Alliance Motions",
          content: (
            <ActiveValue
              href={"/alliance/motions"}
              tooltip="Active motions"
              value={allianceMotions?.active || 0}
            />
          ),
        },
        {
          title: "Alliance Announcements",
          content: (
            <ActiveValue
              href={"/alliance/announcements"}
              tooltip="Active announcements"
              value={allianceAnnouncements?.active || 0}
            />
          ),
        },
      ]}
    />
  );
}
