import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipCoreMembersSummary from "next-common/components/fellowship/core/members/summary";
import FellowshipSummaryActions from "next-common/components/fellowship/core/summary/actions";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { upperFirst } from "lodash-es";

export default function FellowshipCoreCommon({ children, ...props }) {
  const { section } = useCollectivesContext();
  const title = `${upperFirst(section)} Core`;
  const desc = `${section} Core controls the overall process of induction, promotion and demotion according to the ${section} rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.`;
  const seoInfo = { title, desc };

  const corePath = `/${section}/core`;

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      summary={<FellowshipCoreMembersSummary />}
      summaryFooter={<FellowshipSummaryActions />}
      tabs={[
        {
          label: "Members",
          url: corePath,
          urls: [corePath, `/${section}/core/candidates`],
          exactMatch: true,
        },
        {
          label: "Params",
          url: `/${section}/core/params`,
          exactMatch: true,
        },
        {
          label: "Feeds",
          url: `/${section}/core/feeds`,
          exactMatch: true,
        },
      ]}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
