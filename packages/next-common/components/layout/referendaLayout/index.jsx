import ListLayout from "../ListLayout";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import Gov2SummaryFooter from "next-common/components/summary/gov2SummaryFooter";

/**
 * @param {import("../ListLayout").ListLayoutProps & {summaryData: Record<string, any>}} props
 * @description layout for referenda page
 */
export default function ReferendaLayout({ summaryData, ...props }) {
  return (
    <ListLayout
      summary={<Gov2Summary summary={summaryData} />}
      summaryFooter={<Gov2SummaryFooter />}
      description="All active and history referenda of various tracks."
      tabs={[
        { label: "Referenda", url: "/referenda" },
        { label: "Statistics", url: "/referenda/statistics" },
      ]}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
