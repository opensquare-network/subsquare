import useFetchAmbassadorCoreMembers from "next-common/hooks/ambassador/core/useFetchAmbassadorCoreMembers";
import ListLayout from "next-common/components/layout/ListLayout";
import AmbassadorCoreMembersSummary from "next-common/components/ambassador/core/members/summary";
import AmbassadorSummaryActions from "next-common/components/ambassador/core/summary/actions";

export default function AmbassadorCoreCommon({ children, ...props }) {
  const title = "Ambassador Core";
  const desc =
    "The core pallet controls the overall process of induction, promotion and demotion according to the ambassador rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  const seoInfo = { title, desc };
  useFetchAmbassadorCoreMembers();

  const corePath = "/ambassador/core";

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      summary={<AmbassadorCoreMembersSummary />}
      summaryFooter={<AmbassadorSummaryActions />}
      tabs={[
        {
          label: "Members",
          url: corePath,
          urls: [corePath, "/ambassador/core/candidates"],
          exactMatch: true,
        },
        {
          label: "Params",
          url: "/ambassador/core/params",
          exactMatch: true,
        },
        {
          label: "Feeds",
          url: "/ambassador/core/feeds",
          exactMatch: true,
        },
      ]}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
