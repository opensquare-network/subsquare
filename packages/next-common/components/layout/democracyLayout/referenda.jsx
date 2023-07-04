import ListLayout from "../ListLayout";
import DemocracySummary from "next-common/components/summary/v2/democracySummary";

/**
 * @param {import("../ListLayout").ListLayoutProps & {summaryData}} props
 */
export default function DemocracyReferendaLayout({ summaryData, ...props }) {
  return (
    <ListLayout
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      summary={<DemocracySummary summary={summaryData} />}
      tabs={[
        { label: "Referenda", url: "/democracy/referenda" },
        { label: "Statistics", url: "/democracy/statistics" },
      ]}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
