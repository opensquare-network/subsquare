import { SubscribeTip, TitleExtra } from "next-common/components/overview";
import ListLayout from "../ListLayout";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import Gov2SummaryFooter from "next-common/components/summary/gov2SummaryFooter";
import { useUser } from "next-common/context/user";

function HeadContent() {
  return (
    <div className="md:hidden">
      <SubscribeTip />
    </div>
  );
}

/**
 * @param {import("../ListLayout").ListLayoutProps & {summaryData: Record<string, any>}} props
 * @description layout for referenda page
 */
export default function ReferendaLayout({ summaryData, ...props }) {
  const user = useUser();
  return (
    <ListLayout
      titleExtra={<TitleExtra />}
      summary={<Gov2Summary summary={summaryData} />}
      summaryFooter={<Gov2SummaryFooter />}
      headContent={<HeadContent />}
      description="All active and history referenda of various tracks."
      tabs={[
        { label: "Referenda", url: "/referenda" },
        user?.address && { label: "My Votes", url: "/referenda/votes" },
        { label: "Statistics", url: "/referenda/statistics" },
      ].filter(Boolean)}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
