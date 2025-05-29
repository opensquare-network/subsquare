import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipCoreMembersSummary from "next-common/components/fellowship/core/members/summary";
import FellowshipSummaryActions from "next-common/components/fellowship/core/summary/actions";

export default function FellowshipCoreCommon({ children, ...props }) {
  const title = "Fellowship Members";
  const desc =
    "The Technical Fellowship is a self-governing body of experts and developers of Polkadot and Kusama networks protocols. It operates on-chain through the Polkadot Collectives system chain and off-chain through the Polkadot Fellows repository.";
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
