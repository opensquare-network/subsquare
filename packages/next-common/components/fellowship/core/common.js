import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipCoreMembersSummary from "next-common/components/fellowship/core/members/summary";
import FellowshipSummaryActions from "next-common/components/fellowship/core/summary/actions";

export default function FellowshipCoreCommon({ children, ...props }) {
  const title = "Fellowship Members";
  //TODO: Update description
  const desc =
    "The core pallet controls the overall process of induction, promotion and demotion according to the Fellowship rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  const seoInfo = { title, desc };

  const corePath = "/fellowship/members";

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      summary={<FellowshipCoreMembersSummary />}
      summaryFooter={<FellowshipSummaryActions />}
      tabs={[
        {
          value: "members",
          label: "Members",
          url: corePath,
          urls: [corePath, "/fellowship/members/candidates"],
          exactMatch: true,
        },
        {
          value: "feeds",
          label: "Feeds",
          url: "/fellowship/members/feeds",
          exactMatch: true,
        },
      ].filter(Boolean)}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
